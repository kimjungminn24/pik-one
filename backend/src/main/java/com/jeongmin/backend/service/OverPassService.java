package com.jeongmin.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeongmin.backend.client.OverpassFeignClient;
import com.jeongmin.backend.dto.LocationCheckRequest;
import com.jeongmin.backend.dto.LocationCheckResponse;
import com.jeongmin.backend.entity.DecorType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class OverPassService {

    private static final double SEARCH_RADIUS = 100.0;

    private final OverpassFeignClient overpassClient;
    private final ObjectMapper objectMapper;

    public LocationCheckResponse checkLocationDecorTypes(LocationCheckRequest request) throws Exception {
        String query = buildOverpassQuery(request.lat(), request.lng());
        String rawResponse = overpassClient.fetchOverpassData(query);

        Set<DecorType> detectedDecorTypes = parseDecorTypesFromResponse(rawResponse);

        boolean isRegisterable = isLocationRegisterable(detectedDecorTypes, request.type());

        return new LocationCheckResponse(isRegisterable, new ArrayList<>(detectedDecorTypes));
    }

    private String buildOverpassQuery(double lat, double lng) {
        return String.format("""
                [out:json];
                (
                  node(around:%f,%f,%f);
                  way(around:%f,%f,%f);
                );
                out center;
                """, SEARCH_RADIUS, lat, lng, SEARCH_RADIUS, lat, lng);
    }

    private Set<DecorType> parseDecorTypesFromResponse(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        JsonNode elements = root.get("elements");

        if (elements == null || !elements.isArray()) {
            return Collections.emptySet();
        }

        return StreamSupport.stream(elements.spliterator(), false)
                .map(this::extractTags)
                .map(tags -> findMatchingDecorType(tags, convertToSimpleTags(tags)))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private Map<String, String> extractTags(JsonNode element) {
        JsonNode tagsNode = element.get("tags");
        if (tagsNode == null || tagsNode.isNull()) {
            return Collections.emptyMap();
        }

        return objectMapper.convertValue(tagsNode, new TypeReference<>() {
        });
    }

    private Set<String> convertToSimpleTags(Map<String, String> tags) {
        return tags.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.toSet());
    }

    private DecorType findMatchingDecorType(Map<String, String> tags, Set<String> simpleTags) {
        return Arrays.stream(DecorType.values())
                .filter(decorType -> isDecorTypeMatched(decorType, tags, simpleTags))
                .findFirst()
                .orElse(null);
    }

    private boolean isDecorTypeMatched(DecorType decorType, Map<String, String> tags, Set<String> simpleTags) {
        return decorType.getTags().stream()
                .anyMatch(condition -> isConditionMatched(condition, tags, simpleTags));
    }

    private boolean isConditionMatched(String condition, Map<String, String> tags, Set<String> simpleTags) {
        return isAndCondition(condition)
                ? isAndConditionMatched(condition, tags)
                : simpleTags.contains(condition);
    }

    private boolean isAndCondition(String condition) {
        return condition.contains("AND");
    }

    private boolean isAndConditionMatched(String condition, Map<String, String> tags) {
        return Arrays.stream(condition.split("AND"))
                .map(String::trim)
                .map(kv -> kv.split("="))
                .allMatch(kv -> kv.length == 2 && kv[1].trim().equals(tags.get(kv[0].trim())));
    }

    private boolean isLocationRegisterable(Set<DecorType> detectedDecorTypes, DecorType requestedType) {
        return detectedDecorTypes.isEmpty()
                || (detectedDecorTypes.size() == 1 && detectedDecorTypes.contains(requestedType));
    }
}
