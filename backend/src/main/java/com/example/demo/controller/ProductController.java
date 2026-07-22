package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. 上架新商品 - 限制只有 ADMIN 可以操作
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // 2. 取得所有商品列表 - 公開接口，所有人皆可瀏覽
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    // 3. 下架商品 - 限制只有 ADMIN 可以操作
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + id));

        product.setActive(false); // 改為邏輯刪除
        productRepository.save(product);
        return "商品 ID " + id + " 已成功下架 (邏輯刪除)！";
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public Product updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + id));

        // 更新庫存：現有 + 新增
        product.setStock(product.getStock() + quantity);

        return productRepository.save(product);
    }
}