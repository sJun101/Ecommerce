package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired private JwtUtils jwtUtils; // 引入剛剛寫的製卡機

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        // 1. 驗證帳密（我們之前寫好的）
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

        // 2. 驗證成功，製作一張證件給他
        String token = jwtUtils.generateToken(user.getUsername());

        // 3. 回傳這張通行證
        return token;
    }
}