package com.yourcompany.javaengine.service.plotter;

public interface PlottableFunction {
    String getFunctionName();
    double calculateY(double x);
}