package com.jeongmin.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeongmin.backend.client.NaverMapFeignClient;
import com.jeongmin.backend.client.NaverMeClient;
import com.jeongmin.backend.dto.CoordinateDto;
import com.jeongmin.backend.entity.EntryType;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class LocationService {

    private static final double MERCATOR_MAX = 20037508.34;
    private static final Pattern ENTRY_TYPE_PATTERN = Pattern.compile("/entry/(place|subway-station|bus-station)/");
    private static final Pattern PLACE_ID_PATTERN = Pattern.compile("/entry/(?:place|subway-station|bus-station)/(\\d+)");
    private static final Pattern COORDINATES_PATTERN = Pattern.compile("/coordinates/([\\d.]+),([\\d.]+)");

    private final NaverMeClient naverMeClient;
    private final NaverMapFeignClient naverMapFeignClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static CoordinateDto mercatorToWgs84(double x, double y) {
        double lng = (x / MERCATOR_MAX) * 180;

        double lat = (y / MERCATOR_MAX) * 180;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);

        return new CoordinateDto(lat, lng);
    }

    public CoordinateDto parse(String url) {
        String redirectUrl = isSharedUrl(url)
                ? resolveRedirectUrl(extractCode(url))
                : url;

        if (redirectUrl.contains("/coordinates/")) {
            return parseCoordinates(redirectUrl);
        }

        EntryType entryType = extractEntryType(redirectUrl);
        Long placeId = extractPlaceId(redirectUrl);
        return fetchCoordinatesByPlaceId(entryType, placeId);
    }

    private boolean isSharedUrl(String url) {
        return url.contains("naver.me");
    }

    private String resolveRedirectUrl(String code) {
        try {
            naverMeClient.resolve(code);
            throw new IllegalStateException("redirect가 발생하지 않음");
        } catch (FeignException e) {
            Collection<String> locations = e.responseHeaders().get("Location");

            if (locations == null || locations.isEmpty()) {
                throw new IllegalStateException("Location 헤더 없음");
            }

            return locations.iterator().next();
        }
    }

    private String extractCode(String sharedUrl) {
        return sharedUrl.substring(sharedUrl.lastIndexOf("/") + 1);
    }

    private EntryType extractEntryType(String redirectUrl) {
        Matcher matcher = ENTRY_TYPE_PATTERN.matcher(redirectUrl);

        if (!matcher.find()) {
            throw new IllegalStateException("entry type 추출 실패: " + redirectUrl);
        }

        return EntryType.fromValue(matcher.group(1));
    }

    private Long extractPlaceId(String redirectUrl) {
        Matcher matcher = PLACE_ID_PATTERN.matcher(redirectUrl);

        if (!matcher.find()) {
            throw new IllegalStateException("placeId 추출 실패: " + redirectUrl);
        }

        return Long.parseLong(matcher.group(1));
    }

    private CoordinateDto parseCoordinates(String redirectUrl) {
        Matcher matcher = COORDINATES_PATTERN.matcher(redirectUrl);

        if (!matcher.find()) {
            throw new IllegalStateException("좌표 추출 실패: " + redirectUrl);
        }

        double x = Double.parseDouble(matcher.group(1));
        double y = Double.parseDouble(matcher.group(2));

        return mercatorToWgs84(x, y);
    }

    private CoordinateDto fetchCoordinatesByPlaceId(EntryType entryType, Long placeId) {
        String json;

        switch (entryType) {
            case BUS_STATION:
                json = naverMapFeignClient.getBusStopInfo(placeId);
                return parsePublicTransportCoordinate(json);
            case SUBWAY_STATION:
                json = naverMapFeignClient.getSubwayStationInfo(placeId);
                return parsePublicTransportCoordinate(json);
            case PLACE:
            default:
                json = naverMapFeignClient.getPlaceSummary(placeId);
                return parsePlaceCoordinate(json);
        }
    }

    private CoordinateDto parsePlaceCoordinate(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode coordinate = root.path("data")
                    .path("placeDetail")
                    .path("coordinate");

            if (coordinate.isMissingNode()) {
                throw new IllegalStateException("coordinate 정보 없음");
            }

            double lat = coordinate.path("latitude").asDouble();
            double lng = coordinate.path("longitude").asDouble();

            return new CoordinateDto(lat, lng);
        } catch (Exception e) {
            throw new IllegalStateException("장소 좌표 파싱 실패", e);
        }
    }

    private CoordinateDto parsePublicTransportCoordinate(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode point = root.path("point");

            if (point.isMissingNode()) {
                throw new IllegalStateException("point 정보 없음");
            }

            double lng = point.path("x").asDouble();
            double lat = point.path("y").asDouble();

            return new CoordinateDto(lat, lng);
        } catch (Exception e) {
            throw new IllegalStateException("대중교통 좌표 파싱 실패", e);
        }
    }
}
