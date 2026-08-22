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

    @PostMapping
    public Order createOrder(@RequestParam Long productId, @RequestParam Integer quantity) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        orderService.checkout(username);

        return ResponseEntity.ok("結帳成功！訂單已建立，購物車已清空。");
    }
}