package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    // 💡 為了開發方便，我們先固定密鑰，確保重啟不失效
    // 長度必須大於 32 字節 (256 bits)
    private final Key key = Keys.hmacShaKeyFor("your-very-secure-secret-key-must-be-at-least-32-chars".getBytes());
    private final long expiration = 86400000; // 24小時

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // 記得把 role 塞進去
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 回傳 Key 物件，匹配 parserBuilder 的需求
    public Key getKey() {
        return this.key;
    }
}