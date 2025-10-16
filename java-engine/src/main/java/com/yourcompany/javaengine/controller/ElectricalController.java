package com.yourcompany.javaengine.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/electrical")
public class ElectricalController {

    @GetMapping("/calculate")
    public Map<String, Double> calculate(
            @RequestParam(required = false) Double v,
            @RequestParam(required = false) Double i,
            @RequestParam(required = false) Double r,
            @RequestParam(required = false) Double p
    ) {
        // ตัวอย่างคำนวณง่าย ๆ
        if (v != null && i != null) {
            r = v / i;
            p = v * i;
        } else if (v != null && r != null) {
            i = v / r;
            p = v * i;
        } else if (i != null && r != null) {
            v = i * r;
            p = v * i;
        } else if (i != null && p != null) {
            v = p / i;
            r = v / i;
        } else if (v != null && p != null) {
            i = p / v;
            r = v / i;
        } else if (r != null && p != null) {
            i = Math.sqrt(p / r);
            v = i * r;
        } else {
            throw new IllegalArgumentException("Please provide any two values.");
        }

        return Map.of(
                "voltage", v,
                "current", i,
                "resistance", r,
                "power", p
        );
    }
}