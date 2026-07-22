package com.example.demo.repository;

import com.example.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    // 透過 username 查詢該使用者的所有購物車項目
    List<CartItem> findByUsername(String username);

    // 透過 username 和 productId 找到特定商品，方便做「累加數量」的邏輯
    Optional<CartItem> findByUsernameAndProduct_Id(String username, Long productId);

    void deleteByUsernameAndProduct_Id(String username, Long productId);}