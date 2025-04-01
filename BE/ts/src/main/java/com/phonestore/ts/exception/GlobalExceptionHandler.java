package com.phonestore.ts.exception;

import com.phonestore.ts.dto.response.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ResponseObject> handlingRuntimeExcepton(RuntimeException runtimeException){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ResponseObject.builder()
                        .status(ErrorCode.RUNTIME_ERROR.getStatus())
                        .message(ErrorCode.RUNTIME_ERROR.getMessage()+": "+runtimeException.getMessage())
                        .build()
        );
    }
}
