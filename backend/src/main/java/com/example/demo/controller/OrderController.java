package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🎯 重構：移除 @RequestParam Long userId
    // 使用者身分由 JWT 過濾器自動注入 SecurityContext，我們直接從裡面拿
    @PostMapping
    public Order createOrder(@RequestParam Long productId, @RequestParam Integer quantity) {
        // 從 Token 中獲取目前登入者的 username
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 💡 建議：將原本 OrderService 的 placeOrder 參數由 userId 改為 username
        // 這樣能確保系統高度安全性
        return orderService.placeOrder(username, productId, quantity);
    }

    @GetMapping
    public java.util.List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my")
    public java.util.List<Order> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderService.getOrdersByUsername(username);
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout() {
        // 獲取當前登入使用者
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 執行結帳服務
        orderService.checkout(username);

        return ResponseEntity.ok("結帳成功！訂單已建立，購物車已清空。");
    }
}