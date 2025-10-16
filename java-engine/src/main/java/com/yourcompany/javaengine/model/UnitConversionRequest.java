package com.yourcompany.javaengine.model;

public class UnitConversionRequest {
    private String category; // e.g., "length", "mass"
    private String fromUnit; // e.g., "m", "kg"
    private String toUnit;   // e.g., "cm", "g"
    private double value;

    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFromUnit() { return fromUnit; }
    public void setFromUnit(String fromUnit) { this.fromUnit = fromUnit; }
    public String getToUnit() { return toUnit; }
    public void setToUnit(String toUnit) { this.toUnit = toUnit; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
}