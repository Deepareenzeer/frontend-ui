package com.yourcompany.javaengine.service;

import com.yourcompany.javaengine.model.ElectricalCalculationRequest;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ElectricalCalculatorService {

    public Map<String, Double> calculate(ElectricalCalculationRequest request) {
        // --- ส่วนแปลงหน่วย Input ---
        // 1. แปลงกำลังไฟฟ้า (Power) ทั้งหมดให้เป็น วัตต์ (W)
        Double powerInWatts = request.getPower();
        if (powerInWatts != null) {
            String powerUnit = request.getPowerUnit() != null ? request.getPowerUnit().toLowerCase() : "w";
            switch (powerUnit) {
                case "kw": // กิโลวัตต์
                    powerInWatts *= 1000;
                    break;
                case "hp": // แรงม้า (Horsepower)
                    powerInWatts *= 745.7;
                    break;
                case "w": // วัตต์
                default:
                    // ไม่ต้องทำอะไร
                    break;
            }
        }

        // 2. แปลงเวลา (Time) ทั้งหมดให้เป็น ชั่วโมง (h)
        Double timeInHours = request.getTime();
        if (timeInHours != null) {
            String timeUnit = request.getTimeUnit() != null ? request.getTimeUnit().toLowerCase() : "h";
            switch (timeUnit) {
                case "s": // วินาที
                    timeInHours /= 3600;
                    break;
                case "min": // นาที
                    timeInHours /= 60;
                    break;
                case "h": // ชั่วโมง
                default:
                    // ไม่ต้องทำอะไร
                    break;
            }
        }

        Double v = request.getVoltage();
        Double i = request.getCurrent();
        Double p = powerInWatts; // ใช้ค่าที่แปลงเป็นวัตต์แล้ว
        Double t = timeInHours;  // ใช้ค่าที่แปลงเป็นชั่วโมงแล้ว

        // --- ส่วนคำนวณหลัก (ใช้หน่วยฐาน) ---
        // P = V * I
        if (p == null && v != null && i != null) {
            p = v * i;
        } else if (v == null && p != null && i != null && i != 0) {
            v = p / i;
        } else if (i == null && p != null && v != null && v != 0) {
            i = p / v;
        }

        Double energyKwh = null;
        // E (kWh) = (P(W) * t(h)) / 1000
        if (p != null && t != null) {
            energyKwh = (p * t) / 1000.0;
        }

        // --- ส่วนรวบรวมผลลัพธ์ ---
        Map<String, Double> results = new HashMap<>();
        if (v != null) results.put("voltage_V", v);
        if (i != null) results.put("current_A", i);
        if (p != null) {
            results.put("power_W", p); // กำลังไฟฟ้าในหน่วยวัตต์
            results.put("power_kW", p / 1000.0); // กำลังไฟฟ้าในหน่วยกิโลวัตต์
            results.put("power_hp", p / 745.7); // กำลังไฟฟ้าในหน่วยแรงม้า
        }
        if (energyKwh != null) {
            results.put("energy_kWh", energyKwh); // พลังงานไฟฟ้า (หน่วยที่ใช้คิดค่าไฟ)
        }

        if (results.isEmpty()) {
            throw new IllegalArgumentException("Insufficient data to perform any calculation.");
        }

        return results;
    }
}