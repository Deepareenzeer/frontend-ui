package com.yourcompany.javaengine.controller;

import com.yourcompany.javaengine.service.CalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.mariuszgromada.math.mxparser.Expression;
import org.mariuszgromada.math.mxparser.mXparser;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    @Autowired
    private CalculatorService calculatorService; // ฉีด CalculatorService เข้ามาใช้

    @GetMapping("/calculate") // Endpoint: /api/calculator/calculate?op=add&n1=5&n2=3
    public double calculate(@RequestParam String op, @RequestParam double n1, @RequestParam double n2) {
        return calculatorService.calculate(op, n1, n2);
    }

    @GetMapping("/scientific") // Endpoint: /api/calculator/scientific?op=sin&n=90
    public double scientific(@RequestParam String op, @RequestParam double n) {
        return calculatorService.calculateScientific(op, n);
    }

    @GetMapping("/evaluate")
    public ResponseEntity<Double> evaluateExpression(
            @RequestParam String expression,
            @RequestParam(defaultValue = "deg") String mode) { // ** เพิ่ม RequestParam 'mode' **
        try {
            // ** ตั้งค่าโหมดการคำนวณก่อน **
            if (mode.equalsIgnoreCase("deg")) {
                mXparser.setDegreesMode();
            } else {
                mXparser.setRadiansMode();
            }

            Expression e = new Expression(expression);
            double result = e.calculate();

            if (Double.isNaN(result)) {
                // ส่งข้อความ Error ที่สื่อความหมายมากขึ้น
                return ResponseEntity.badRequest().body(null);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
