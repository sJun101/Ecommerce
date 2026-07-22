package com.example.demo.service;

import com.example.demo.entity.CartItem;
import java.util.List;

public interface CartService {
    void addToCart(String username, Long productId, Integer quantity);
    List<CartItem> getCartItems(String username);
    void updateQuantity(String username, Long productId, Integer quantity);
    void removeItem(String username , Long productId);

}