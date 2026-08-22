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
    @Autowired private CartRepository cartRepository;


    @Override
    @Transactional
    public Order placeOrder(String username, Long productId, Integer quantity) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("找不到使用者: " + username));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + productId));


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


    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUserUsername(username);
    }

    @Override
    @Transactional
    public void checkout(String username) {

        List<CartItem> cartItems = cartRepository.findByUsername(username);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("購物車是空的，無法結帳");
        }


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("找不到使用者"));


        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            // 檢查庫存
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("商品 " + product.getName() + " 庫存不足！");
            }

            // 扣庫存
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            // 建立訂單記錄
            Order order = new Order();
            order.setUser(user);
            order.setProduct(product);
            order.setQuantity(item.getQuantity());
            order.setTotalAmount(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
            orderRepository.save(order);
        }

        // 4. 清空購物車
        cartRepository.deleteAll(cartItems);
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("找不到訂單 ID: " + orderId));


        order.setStatus(status);
        orderRepository.save(order);
    }

}