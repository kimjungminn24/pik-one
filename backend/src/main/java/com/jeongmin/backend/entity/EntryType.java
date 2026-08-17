package com.jeongmin.backend.entity;


public enum EntryType {
    PLACE("place"),
    BUS_STATION("bus-station"),
    SUBWAY_STATION("subway-station");

    private final String value;

    EntryType(String value) {
        this.value = value;
    }

    public static EntryType fromValue(String value) {
        for (EntryType type : values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("알 수 없는 entry type: " + value);
    }

    public String getValue() {
        return value;
    }
}