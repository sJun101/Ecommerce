package com.example.demo.service.impl;

import com.example.demo.entity.CartItem;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CartService;import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public void addToCart(String username, Long productId, Integer quantity) {
        var existingItem = cartRepository.findByUsernameAndProduct_Id(username, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepository.save(item);
        } else {
            var product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("商品不存在"));

            CartItem newItem = new CartItem(product, quantity);
            newItem.setUsername(username);
            cartRepository.save(newItem);
        }
    }

    @Override // 標註重寫介面方法
    public List<CartItem> getCartItems(String username) {
        return cartRepository.findByUsername(username);
    }

    @Override
    public void updateQuantity(String username, Long productId, Integer quantity){
        var existingItem = cartRepository.findByUsernameAndProduct_Id(username, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(quantity); // 更新為新的數量
            cartRepository.save(item);
        } else {
            throw new RuntimeException("購物車中找不到此商品");
        }

    }

    @Override
    @Transactional
    public void removeItem(String username , Long productId){
        cartRepository.deleteByUsernameAndProduct_Id(username, productId);
    }
}