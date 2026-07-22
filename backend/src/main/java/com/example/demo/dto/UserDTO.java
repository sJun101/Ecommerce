package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String username;
    private String role;
    private LocalDateTime createdAt;

    // 建立一個靜態轉換方法 (Factory Method)
    public static UserDTO fromEntity(com.example.demo.entity.User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    // Getters and Setters ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}