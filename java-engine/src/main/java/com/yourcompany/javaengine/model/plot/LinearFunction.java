package com.yourcompany.javaengine.model.plot;



/**
 * คลาสนี้เป็นตัวแทนของสมการเส้นตรง y = mx + c
 * โดย implement PlottableFunction เพื่อให้สามารถนำไปวาดกราฟได้
 */

public class LinearFunction implements PlottableFunction {

    private final double m; // ค่าความชัน (slope)
    private final double c; // ค่าจุดตัดแกน y (y-intercept)

    public LinearFunction(double m, double c) {
        this.m = m;
        this.c = c;
    }

    /**
     * คำนวณค่า y จากสมการ y = mx + c
     * นี่คือการ implement เมธอดที่บังคับมาจาก PlottableFunction interface
     */
    @Override
    public double calculateY(double x) {
        return (m * x) + c;
    }
}