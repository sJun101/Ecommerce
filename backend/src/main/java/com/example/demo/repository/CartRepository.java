package com.example.demo.repository;

import com.example.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUsername(String username);

    Optional<CartItem> findByUsernameAndProduct_Id(String username, Long productId);

    void deleteByUsernameAndProduct_Id(String username, Long productId);}