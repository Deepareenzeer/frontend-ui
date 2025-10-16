package com.yourcompany.javaengine.controller;

// อย่าลืม import Map, HashMap, และ ResponseEntity
import com.yourcompany.javaengine.model.UnitConversionRequest;
import com.yourcompany.javaengine.service.UnitConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/converter")
public class UnitConversionController {

    private final UnitConversionService unitConversionService;

    // ใช้ Constructor Injection ซึ่งเป็นวิธีที่แนะนำ
    public UnitConversionController(UnitConversionService unitConversionService) {
        this.unitConversionService = unitConversionService;
    }

    // ✅ แก้ไข 1: เปลี่ยน Endpoint จาก "/unit" เป็น "/convert"
    @PostMapping("/convert")
    public ResponseEntity<Map<String, Double>> convertUnits(@RequestBody UnitConversionRequest request) {
        try {
            double result = unitConversionService.convert(request);

            // ✅ แก้ไข 2: สร้าง Map เพื่อส่งผลลัพธ์กลับในรูปแบบ {"result": 123.45}
            // ซึ่งตรงกับที่ Frontend คาดหวัง
            Map<String, Double> response = new HashMap<>();
            response.put("result", result);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}