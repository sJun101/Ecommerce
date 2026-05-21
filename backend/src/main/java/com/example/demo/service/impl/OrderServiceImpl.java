package com.example.demo.service.impl;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List; // 1. 必須加這行，List 才不會紅字

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // --- 你原本寫好的下單邏輯 (保留) ---
    @Override
    @Transactional
    public Order placeOrder(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        if (product.getStock() < quantity) {
            throw new RuntimeException("庫存不足！目前剩餘：" + product.getStock());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setTotalAmount(product.getPrice().multiply(new BigDecimal(quantity)));

        return orderRepository.save(order);
    }

    // --- 2. 補上這個方法，解決查詢問題 ---
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll(); // orderRepository 已經在上面定義過了，這裡不會紅字
    }
}