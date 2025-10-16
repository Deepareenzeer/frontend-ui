package com.yourcompany.javaengine.model;

public class ElectricalCalculationRequest {
    // ค่าที่รับเข้ามา
    private Double voltage;
    private Double current;
    private Double power;
    private Double time;
    
    // หน่วยของค่าที่รับเข้ามา (ถ้าไม่ระบุจะใช้ค่า Default)
    private String powerUnit; // W, kW, hp
    private String timeUnit;  // s, min, h

    // Getters and Setters
    public Double getVoltage() { return voltage; }
    public void setVoltage(Double voltage) { this.voltage = voltage; }
    public Double getCurrent() { return current; }
    public void setCurrent(Double current) { this.current = current; }
    public Double getPower() { return power; }
    public void setPower(Double power) { this.power = power; }
    public Double getTime() { return time; }
    public void setTime(Double time) { this.time = time; }
    public String getPowerUnit() { return powerUnit; }
    public void setPowerUnit(String powerUnit) { this.powerUnit = powerUnit; }
    public String getTimeUnit() { return timeUnit; }
    public void setTimeUnit(String timeUnit) { this.timeUnit = timeUnit; }
}