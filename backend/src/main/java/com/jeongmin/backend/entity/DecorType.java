package com.jeongmin.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public enum DecorType {

    RESTAURANT("음식점", List.of("amenity=restaurant")),
    CAFE("카페", List.of("amenity=cafe", "cuisine=coffee_shop")),
    SWEET_SHOP("과자 가게", List.of("shop=confectionery", "shop=pastry")),
    MOVIE_THEATER("영화관", List.of("amenity=cinema")),
    PHARMACY("약국", List.of("amenity=pharmacy")),
    ZOO("동물원", List.of("tourism=zoo")),
    FOREST("숲", List.of("landuse=forest", "natural=wood")),
    WATERSIDE("물가", List.of("natural=water")),
    POST_OFFICE("우체국", List.of("amenity=post_office")),
    ART_GALLERY("미술관", List.of("shop=art", "tourism=museum", "tourism=gallery")),
    AIRPORT("공항", List.of("aeroway=aerodrome", "aeroway=heliport")),
    STATION("기차역", List.of("building=train_station", "railway=station")),
    BEACH("해변", List.of("natural=beach")),
    BURGER_PLACE("버거 가게", List.of("amenity=fast_food", "cuisine=burger")),
    CORNER_STORE("편의점", List.of("shop=convenience")),
    SUPERMARKET("슈퍼마켓", List.of("shop=supermarket")),
    BAKERY("빵집", List.of("cuisine=pretzel", "shop=bakery")),
    HAIR_SALON("미용실", List.of("shop=hairdresser")),
    CLOTHES_STORE("의류 매장", List.of("shop=clothes", "shop=shoes")),
    PARK("공원", List.of("leisure=park")),
    LIBRARY_BOOKSTORE("도서관 및 서점", List.of("amenity=library")),
    SUSHI_RESTAURANT("초밥집", List.of("cuisine=sushi")),
    MOUNTAIN("산", List.of("natural=peak")),
    STADIUM("경기장", List.of("leisure=stadium")),
    THEME_PARK("테마파크", List.of("tourism=theme_park")),
    BUS_STOP("버스 정류장", List.of("highway=bus_stop")),
    ITALIAN_RESTAURANT("이탈리안 레스토랑", List.of("cuisine=italian", "cuisine=pasta", "cuisine=pizza")),
    RAMEN_RESTAURANT("라멘집",
            List.of("cuisine=chinese", "cuisine=noodle", "cuisine=ramen", "cuisine=soba", "cuisine=udon")),
    BRIDGE("다리", List.of("bridge=viaduct", "bridge=yes")),
    HOTEL("호텔", List.of("tourism=hotel")),
    MAKEUP_STORE("화장품 매장", List.of("amenity=pharmacy", "shop=cosmetics", "shop=department_store")),
    SHRINE_TEMPLE("사원 및 절", List.of(
            "building=shrine AND religion=shinto",
            "building=shrine AND religion=buddhist",
            "building=temple AND religion=shinto",
            "building=temple AND religion=buddhist"
    )),
    APPLIANCES_STORE("전자제품 매장", List.of("shop=appliance", "shop=computer", "shop=electronics", "utility=power")),
    CURRY_RESTAURANT("카레집", List.of("cuisine=curry", "cuisine=indian", "cuisine=nepalese")),
    DIY_STORE("공구/철물점", List.of("shop=doityourself", "shop=hardware")),
    UNIVERSITY_COLLEGE("대학교", List.of("amenity=college", "amenity=university", "building=university")),
    MEXICAN_RESTAURANT("멕시칸 음식점", List.of("cuisine=mexican", "cuisine='tex-mex'")),
    LAUNDRY("세탁소", List.of("shop=dry_cleaning", "shop=laundry")),
    KOREAN_RESTAURANT("한식당", List.of("cuisine=korean")),
    STREET("길거리", List.of("highway=residential"));

    private final String koreanName;
    private final List<String> tags;

}
