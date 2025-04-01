package com.phonestore.ts.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    OK(1000,"ok"),
    RUNTIME_ERROR(1001,"Runtime error")
    ;

    private final int status;
    private final String message;
}
