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

    // --- 你原本寫好的下單邏輯 (保留) ---
    @Override
    @Transactional
    public Order placeOrder(String username, Long productId, Integer quantity) {
        // 1. 透過 username 找到用戶 (比直接拿 userId 更安全)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("找不到使用者: " + username));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + productId));

        // 2. 業務邏輯保持不變
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

    @Override
    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUserUsername(username);
    }

    @Override
    @Transactional
    public void checkout(String username) {
        // 1. 取得購物車資料
        List<CartItem> cartItems = cartRepository.findByUsername(username);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("購物車是空的，無法結帳");
        }

        // 2. 透過 username 找到用戶
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("找不到使用者"));

        // 3. 處理每一項購物車商品
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

        // 假設你的 Order 實體裡面有 setStatus 欄位
        order.setStatus(status);
        orderRepository.save(order);
    }

}