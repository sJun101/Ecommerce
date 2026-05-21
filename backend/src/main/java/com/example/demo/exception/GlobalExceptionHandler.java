package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 這個註解告訴 Spring：我是全公司的錯誤處理中心
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 只要程式噴出 RuntimeException，就由這個方法處理
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        // 我們把 HTTP 狀態碼改為 400 (Bad Request)，並回傳訊息內容
        return ResponseEntity.status(400).body("系統提醒：" + e.getMessage());
    }
}