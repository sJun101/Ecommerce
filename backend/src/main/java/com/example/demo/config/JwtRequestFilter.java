package com.example.demo.config;

import com.example.demo.util.JwtUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    // 🎯 建構子注入，讓 Spring 自動把工具類帶進來 [6, 7]
    public JwtRequestFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return; // 這裡一定要 return，否則會繼續執行
        }
        // 1. 攔截前端請求的 Header，看看有沒有攜帶通行證 [8, 9]
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        String role = null;

        // 2. 驗證是否符合標準的 Bearer Token 格式 [8, 10]
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // 拔掉 "Bearer " 這 7 個字 [8]
            try {
                // 🎯 這是最穩定的相容性解密寫法，能避開套件版本衝突 [8]
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(jwtUtils.getKey()) // 拿工具類裡的密鑰來解密 [8, 11]
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                username = claims.getSubject();
                role = claims.get("role", String.class); // 💡 從 Token 提取角色 [4]
            } catch (Exception e) {
                // 如果 Token 過期或被竄改，會在控制台印出原因 [8, 12]
                System.out.println("安全提醒 - JWT 解析失敗: " + e.getMessage());
            }
        }

        // 3. 如果成功拿到帳號，且系統目前還沒幫他掛上識別證 [4, 8]
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 將角色轉換為 Spring Security 識別的 SimpleGrantedAuthority [4, 13]
            List<SimpleGrantedAuthority> authorities = List.of();
            if (role != null && !role.isEmpty()) {
                // 確保權限格式以 ROLE_ 開頭，以便後端 hasRole 檢查 [4, 14, 15]
                String authorityName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                authorities = List.of(new SimpleGrantedAuthority(authorityName));
            }

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            // 🎯 正式在 Spring Security 裡面幫他掛上合法識別證 [4, 16]
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            System.out.println(">>> [SUCCESS] 使用者 " + username + " 驗證成功，權限已注入 [17]");
        }

        // 4. 檢查完畢，放行讓請求進入下一個過濾器 [9, 16]
        filterChain.doFilter(request, response);
    }
}