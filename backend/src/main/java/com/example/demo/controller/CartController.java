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

    // 業務邏輯與 Product 的查詢已封裝在 CartService 中，此處不需要再注入 ProductRepository

    @PostMapping("/add")
    public String addToCart(@RequestBody CartRequest request) {
        // 從 JWT 的 SecurityContext 獲取當前使用者名稱
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 呼叫 Service 執行業務邏輯
        cartService.addToCart(username, request.getProductId(), request.getQuantity());

        return "商品已成功加入您的購物車";
    }

    @GetMapping
    public List<CartItem> getMyCart() {
        // 從 JWT 的 SecurityContext 獲取當前使用者名稱
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 修正：正確呼叫 Service 方法
        return cartService.getCartItems(username);
    }

    @PutMapping("/update")
    public String updateCart(@RequestParam Long productId, @RequestParam Integer quantity) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.updateQuantity(username, productId, quantity);
        return "購物車數量已更新";
    }

    // 🎯 補上這個對應前端 /api/cart/remove/{productId} 的刪除路由
    @DeleteMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.removeItem(username, productId);
        return "商品已從購物車移除";
    }
}