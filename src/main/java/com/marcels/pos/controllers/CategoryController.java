package com.marcels.pos.controllers;

import com.marcels.pos.models.entities.Category;
import com.marcels.pos.models.repositories.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Inyectamos el repositorio directamente, sin pasar por un Service
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Listar todas las categorías en Swagger
    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // Crear una nueva categoría desde Swagger
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
}