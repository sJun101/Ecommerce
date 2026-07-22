package com.example.demo.service;
import com.example.demo.entity.Order;import java.util.List;

public interface OrderService {
    Order placeOrder(String userId, Long productId, Integer quantity);
    // 在原本的 placeOrder 下面增加這一行
    java.util.List<Order> getAllOrders();

    List<Order> getOrdersByUsername(String username);

    void checkout(String username);

    void updateOrderStatus(Long orderId, String status );
}