package com.example.demo.service;
import com.example.demo.entity.Order;import java.util.List;

public interface OrderService {
    Order placeOrder(String userId, Long productId, Integer quantity);

    java.util.List<Order> getAllOrders();

    List<Order> getOrdersByUsername(String username);

    void checkout(String username);

    void updateOrderStatus(Long orderId, String status );
}