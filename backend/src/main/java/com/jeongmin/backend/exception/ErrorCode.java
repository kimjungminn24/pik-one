package com.jeongmin.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다"),
    DUPLICATE_DECOR(HttpStatus.BAD_REQUEST, "해당 위치에 같은 타입의 모종이 이미 존재합니다"),
    DUPLICATE_FEEDBACK(HttpStatus.BAD_REQUEST, "해당 모종에 이미 피드백을 남겼습니다"),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다"),
    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다"),

    NO_PERMISSION_DECOR_DELETE(HttpStatus.FORBIDDEN, "모종을 삭제할 권한이 없습니다"),
    NO_PERMISSION_FEEDBACK_DELETE(HttpStatus.FORBIDDEN, "피드백을 삭제할 권한이 없습니다"),

    NOT_FOUND(HttpStatus.NOT_FOUND, "리소스를 찾을 수 없습니다"),
    DECOR_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 모종을 찾을 수 없거나 삭제된 상태입니다"),
    FEEDBACK_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 피드백을 찾을 수 없습니다"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다"),

    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다"),
    INVALID_OVERPASS_RESPONSE(HttpStatus.INTERNAL_SERVER_ERROR, "Overpass 응답을 처리할 수 없습니다"),

    EXTERNAL_API_ERROR(HttpStatus.BAD_GATEWAY, "외부 API 요청에 실패했습니다");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
