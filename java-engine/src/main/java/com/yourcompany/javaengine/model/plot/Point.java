package com.yourcompany.javaengine.model.plot;

/**
 * คลาสนี้ใช้สำหรับเก็บข้อมูลจุดพิกัด (x, y)
 * เป็น Data Transfer Object (DTO) แบบง่าย
 */
public class Point {
    public double x;
    public double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
}