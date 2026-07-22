package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    // 取得當前登入者的資訊 (前端呼叫 GET /api/users/me)
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyInfo(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    // 查詢特定使用者 (僅限管理員)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }
}