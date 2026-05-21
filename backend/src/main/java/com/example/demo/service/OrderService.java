package com.example.demo.service;
import com.example.demo.entity.Order;

public interface OrderService {
    Order placeOrder(Long userId, Long productId, Integer quantity);
    // 在原本的 placeOrder 下面增加這一行
    java.util.List<Order> getAllOrders();
}