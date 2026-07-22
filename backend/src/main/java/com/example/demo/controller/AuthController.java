package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired private JwtUtils jwtUtils; // 引入剛剛寫的製卡機

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. 驗證帳密
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

        // 2. 製作通行證 (現在帶入 user.getRole())
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());

        // 3. 回傳結構化 JSON，而不是單純的 String
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // 假設你的 UserService 已經有 register 方法
        // 這邊建議把 user 的 role 預設設為 'USER'
        userService.register(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "註冊成功！"));
    }
}