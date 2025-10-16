package com.yourcompany.javaengine.model;

public class UnitConversionResponse {
    private double result;
    private String unit;

    public UnitConversionResponse(double result, String unit) {
        this.result = result;
        this.unit = unit;
    }

    // Getters and Setters
    public double getResult() { return result; }
    public void setResult(double result) { this.result = result; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}