package com.yourcompany.javaengine.model.plot;

/**
 * Interface นี้เป็นสัญญาสำหรับฟังก์ชันทางคณิตศาสตร์ที่สามารถนำไปพล็อตเป็นกราฟได้
 * คลาสใดๆ ที่ implement interface นี้ จะต้องมีเมธอดสำหรับคำนวณค่า y จากค่า x
 */
public interface PlottableFunction {
    double calculateY(double x);
}