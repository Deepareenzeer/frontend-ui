package com.yourcompany.javaengine.controller;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.yourcompany.javaengine.service.CurrencyService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/currency")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    // Endpoint: /api/currency/convert?from=USD&to=THB&amount=100
    @GetMapping("/convert")
    public ResponseEntity<Map<String, Double>> convert( // <--- เปลี่ยน Response Type
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount) {
        try {
            // คำนวณยอดเงินที่แปลงแล้ว
            double convertedAmount = currencyService.convert(from, to, amount);
            // คำนวณอัตราแลกเปลี่ยน (rate)
            double rate = convertedAmount / amount;

            // สร้าง "กล่องพัสดุ" (Map) เพื่อใส่ข้อมูล 2 ชิ้น
            Map<String, Double> response = new HashMap<>();
            response.put("convertedAmount", convertedAmount);
            response.put("rate", rate);

            return ResponseEntity.ok(response); // ✅ ส่ง "กล่องพัสดุ" ทั้งใบกลับไป

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/currencies")
    public Map<String, Double> currencies() {
        return currencyService.getAllCurrencies();
    }
}

