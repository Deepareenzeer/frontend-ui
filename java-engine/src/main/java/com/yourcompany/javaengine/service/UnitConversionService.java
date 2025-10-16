package com.yourcompany.javaengine.service;

import com.yourcompany.javaengine.model.UnitConversionRequest;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class UnitConversionService {

    private static final Map<String, String> BASE_UNITS = Map.of(
        "length", "m",      // หน่วยฐาน: เมตร
        "mass", "kg",       // หน่วยฐาน: กิโลกรัม
        "volume", "L",      // หน่วยฐาน: ลิตร
        "area", "m2",       // หน่วยฐาน: ตารางเมตร
        "time", "s",        // หน่วยฐาน: วินาที
        "speed", "m/s",     // หน่วยฐาน: เมตรต่อวินาที
        "energy", "J"       // หน่วยฐาน: จูล
    );

    private static final Map<String, Double> TO_BASE_CONVERSIONS = Map.ofEntries(
        // --- ความยาว (Length) ---
        Map.entry("m", 1.0), Map.entry("cm", 0.01), Map.entry("mm", 0.001),
        Map.entry("km", 1000.0), Map.entry("in", 0.0254), Map.entry("ft", 0.3048),
        Map.entry("yd", 0.9144), Map.entry("mi", 1609.34), Map.entry("nmi", 1852.0),

        // --- มวล (Mass) ---
        Map.entry("kg", 1.0), Map.entry("g", 0.001), Map.entry("mg", 0.000001),
        Map.entry("t", 1000.0), Map.entry("oz", 0.0283495), Map.entry("lb", 0.453592),

        // --- ปริมาตร (Volume) ---
        Map.entry("L", 1.0), Map.entry("mL", 0.001), Map.entry("m3", 1000.0),
        Map.entry("cm3", 0.001), Map.entry("gal", 3.78541), Map.entry("qt", 0.946353),
        Map.entry("pt", 0.473176), Map.entry("cup", 0.24), Map.entry("fl-oz", 0.0295735),
        Map.entry("tbsp", 0.0147868), Map.entry("tsp", 0.00492892),

        // --- พื้นที่ (Area) ---
        Map.entry("m2", 1.0), Map.entry("cm2", 0.0001), Map.entry("km2", 1_000_000.0),
        Map.entry("ha", 10_000.0), Map.entry("rai", 1600.0), Map.entry("sq-in", 0.00064516),
        Map.entry("sq-ft", 0.092903), Map.entry("sq-yd", 0.836127),
        Map.entry("ac", 4046.86), Map.entry("sq-mi", 2_590_000.0),

        // --- เวลา (Time) -> วินาที (s) ---
        Map.entry("s", 1.0), Map.entry("ms", 0.001), Map.entry("min", 60.0),
        Map.entry("h", 3600.0), Map.entry("day", 86400.0),Map.entry("d", 86400.0),

        // --- ความเร็ว (Speed) -> เมตรต่อวินาที (m/s) ---
        Map.entry("m/s", 1.0), Map.entry("km/h", 0.277778), Map.entry("mph", 0.44704),
        Map.entry("ft/s", 0.3048), Map.entry("kn", 0.514444),

        // --- พลังงาน (Energy) -> จูล (J) ---
        Map.entry("J", 1.0), Map.entry("kJ", 1000.0), Map.entry("cal", 4.184),
        Map.entry("kcal", 4184.0), Map.entry("Wh", 3600.0), Map.entry("kWh", 3_600_000.0),
        Map.entry("eV", 1.602176634e-19)
    );

    public double convert(UnitConversionRequest request) {
        String category = request.getCategory().toLowerCase();

        // ✅ หมวดพิเศษ: อุณหภูมิ
        if ("temperature".equals(category)) {
            return convertTemperature(request.getFromUnit(), request.getToUnit(), request.getValue());
        }

        // ✅ ตรวจว่าหมวดนี้รองรับไหม
        if (!BASE_UNITS.containsKey(category)) {
            throw new IllegalArgumentException("Unsupported category: " + category);
        }

        // ✅ หา factor จากหน่วยต้นทาง
        double fromFactor = TO_BASE_CONVERSIONS.getOrDefault(request.getFromUnit(), 0.0);
        if (fromFactor == 0.0) throw new IllegalArgumentException("Invalid 'from' unit: " + request.getFromUnit());

        double valueInBaseUnit = request.getValue() * fromFactor;

        // ✅ แปลงไปยังหน่วยปลายทาง
        double toFactor = TO_BASE_CONVERSIONS.getOrDefault(request.getToUnit(), 0.0);
        if (toFactor == 0.0) throw new IllegalArgumentException("Invalid 'to' unit: " + request.getToUnit());

        return valueInBaseUnit / toFactor;
    }

    // ✅ อุณหภูมิ (Temperature)
    private double convertTemperature(String fromUnit, String toUnit, double value) {
        double valueInCelsius;
        switch (fromUnit.toUpperCase()) {
            case "C":
                valueInCelsius = value;
                break;
            case "F":
                valueInCelsius = (value - 32) * 5.0 / 9.0;
                break;
            case "K":
                valueInCelsius = value - 273.15;
                break;
            default:
                throw new IllegalArgumentException("Unsupported 'from' temperature unit: " + fromUnit);
        }

        switch (toUnit.toUpperCase()) {
            case "C":
                return valueInCelsius;
            case "F":
                return (valueInCelsius * 9.0 / 5.0) + 32;
            case "K":
                return valueInCelsius + 273.15;
            default:
                throw new IllegalArgumentException("Unsupported 'to' temperature unit: " + toUnit);
        }
    }
}
