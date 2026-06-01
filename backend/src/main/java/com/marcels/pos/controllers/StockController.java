package com.marcels.pos.controllers;

import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.StockRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockRepository stockRepository;

    public StockController(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public List<Stock> getAll() {
        return stockRepository.findAll();
    }
}