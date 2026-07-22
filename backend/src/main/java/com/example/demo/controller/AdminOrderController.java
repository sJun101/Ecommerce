package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders") // 🎯 完美對應 SecurityConfig 的 /api/admin/**
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. 取得全站所有訂單 (管理員專用)
    @GetMapping
    public List<Order> getAllOrdersForAdmin() {
        return orderService.getAllOrders();
    }

    // 2. 修改訂單狀態 (待出貨 -> 已出貨 -> 已到貨 -> 已取貨)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable("orderId") Long orderId,
            @RequestParam String status) {

        // 呼叫你的 Service 去更新狀態 (請確保你的 OrderService 有這支方法)
        orderService.updateOrderStatus(orderId, status);

        return ResponseEntity.ok("訂單狀態已成功更新為: " + status);
    }
}