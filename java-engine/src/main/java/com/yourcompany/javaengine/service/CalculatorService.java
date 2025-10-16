package com.yourcompany.javaengine.service;


import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public double calculate(String operation, double num1, double num2) {
        switch (operation) {
            case "add": return num1 + num2;
            case "subtract": return num1 - num2;
            case "multiply": return num1 * num2;
            case "divide":
                if (num2 == 0) {
                    
                    throw new ArithmeticException("Cannot divide by zero!");
                }
                return num1 / num2;
            default:
                throw new IllegalArgumentException("Invalid operation: " + operation);
        }
    }

    public double calculateScientific(String operation, double num) {
        switch (operation) {
            case "sin": return Math.sin(Math.toRadians(num)); // แปลงเป็นเรเดียนก่อน
            case "cos": return Math.cos(Math.toRadians(num));
            case "tan": return Math.tan(Math.toRadians(num));
            case "log": return Math.log10(num); // Log ฐาน 10
            case "sqrt": return Math.sqrt(num);
            default:
                throw new IllegalArgumentException("Invalid scientific operation: " + operation);
        }
    }
}