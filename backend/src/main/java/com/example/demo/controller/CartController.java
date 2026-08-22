package com.example.demo.controller;

import com.example.demo.dto.CartRequest;
import com.example.demo.entity.CartItem;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;



    @PostMapping("/add")
    public String addToCart(@RequestBody CartRequest request) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();


        cartService.addToCart(username, request.getProductId(), request.getQuantity());

        return "商品已成功加入您的購物車";
    }

    @GetMapping
    public List<CartItem> getMyCart() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();


        return cartService.getCartItems(username);
    }

    @PutMapping("/update")
    public String updateCart(@RequestParam Long productId, @RequestParam Integer quantity) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.updateQuantity(username, productId, quantity);
        return "購物車數量已更新";
    }


    @DeleteMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.removeItem(username, productId);
        return "商品已從購物車移除";
    }
}