package com.yourcompany.javaengine.controller;

import com.yourcompany.javaengine.service.PlotterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/plotter")
public class PlotterController {

    private final PlotterService plotterService;

    public PlotterController(PlotterService plotterService) {
        this.plotterService = plotterService;
    }

    // Endpoint สำหรับกราฟ 2D (y = f(x))
    @GetMapping("/2d")
    public ResponseEntity<List<Map<String, Double>>> get2dPlotData(
            @RequestParam String expression,
            @RequestParam(defaultValue = "-10") double min,
            @RequestParam(defaultValue = "10") double max,
            @RequestParam(defaultValue = "0.1") double step) {
        try {
            List<Map<String, Double>> data = plotterService.generate2dData(expression, min, max, step);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint สำหรับกราฟ 3D (z = f(x, y))
    @GetMapping("/3d")
    public ResponseEntity<Map<String, Object>> get3dPlotData(
            @RequestParam String expression,
            @RequestParam(defaultValue = "-5") double xMin,
            @RequestParam(defaultValue = "5") double xMax,
            @RequestParam(defaultValue = "-5") double yMin,
            @RequestParam(defaultValue = "5") double yMax,
            @RequestParam(defaultValue = "0.2") double step) {
        try {
            Map<String, Object> data = plotterService.generate3dData(expression, xMin, xMax, yMin, yMax, step);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/complex")
    public ResponseEntity<Map<String, Object>> getComplexPlotData(
            @RequestParam String uExpression, // รับส่วนจริง
            @RequestParam String vExpression, // รับส่วนจินตภาพ
            @RequestParam(defaultValue = "-5") double min,
            @RequestParam(defaultValue = "5") double max,
            @RequestParam(defaultValue = "300") int resolution) {
        try {
            Map<String, Object> data = plotterService.generateComplexFromParts(uExpression, vExpression, min, max, resolution);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/implicit")
    public ResponseEntity<Map<String, Object>> getImplicitPlotData(
            @RequestParam String expression,
            @RequestParam(defaultValue = "-10") double xMin,
            @RequestParam(defaultValue = "10") double xMax,
            @RequestParam(defaultValue = "-10") double yMin,
            @RequestParam(defaultValue = "10") double yMax,
            @RequestParam(defaultValue = "400") int resolution) {
        try {
            Map<String, Object> data = plotterService.generateImplicitData(expression, xMin, xMax, yMin, yMax, resolution);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}