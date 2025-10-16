package com.yourcompany.javaengine.service;

import org.mariuszgromada.math.mxparser.Argument;
import org.mariuszgromada.math.mxparser.Expression;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.math3.complex.Complex;



@Service
public class PlotterService {

    public List<Map<String, Double>> generate2dData(String expression, double min, double max, double step) {
        List<Map<String, Double>> data = new ArrayList<>();
        Argument x = new Argument("x");
        Expression exp = new Expression(expression, x);

        for (double i = min; i <= max; i += step) {
            x.setArgumentValue(i);
            double y = exp.calculate();
            if (!Double.isNaN(y)) {
                Map<String, Double> point = new HashMap<>();
                point.put("x", i);
                point.put("y", y);
                data.add(point);
            }
        }
        return data;
    }

    public Map<String, Object> generate3dData(String expression, double xMin, double xMax, double yMin, double yMax, double step) {
        Argument x = new Argument("x");
        Argument y = new Argument("y");
        Expression exp = new Expression(expression, x, y);

        List<Double> xValues = new ArrayList<>();
        List<Double> yValues = new ArrayList<>();
        List<List<Double>> zValues = new ArrayList<>();

        for (double currentY = yMin; currentY <= yMax; currentY += step) {
            yValues.add(currentY);
            List<Double> zRow = new ArrayList<>();
            y.setArgumentValue(currentY);

            for (double currentX = xMin; currentX <= xMax; currentX += step) {
                if (yValues.size() == 1) { // เพิ่มค่า x แค่ครั้งแรก
                    xValues.add(currentX);
                }
                x.setArgumentValue(currentX);
                double z = exp.calculate();
                zRow.add(Double.isNaN(z) ? null : z);
            }
            zValues.add(zRow);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("x", xValues);
        data.put("y", yValues);
        data.put("z", zValues);
        return data;
    }

     public Map<String, Object> generateComplexFromParts(
            String uExpression, String vExpression,
            double min, double max, int resolution) {

        Argument x = new Argument("x");
        Argument y = new Argument("y");
        // สร้าง Expression สำหรับส่วนจริง (u) และส่วนจินตภาพ (v)
        Expression uExp = new Expression(uExpression, x, y);
        Expression vExp = new Expression(vExpression, x, y);

        List<List<Double>> hueData = new ArrayList<>();
        List<List<Double>> brightnessData = new ArrayList<>();
        double step = (max - min) / resolution;

        for (double im = max; im >= min; im -= step) { // im คือค่า y
            List<Double> hueRow = new ArrayList<>();
            List<Double> brightnessRow = new ArrayList<>();
            y.setArgumentValue(im); // กำหนดค่า y ให้กับ Expression

            for (double re = min; re <= max; re += step) { // re คือค่า x
                x.setArgumentValue(re); // กำหนดค่า x ให้กับ Expression

                // คำนวณค่า u และ v แยกกัน
                double u = uExp.calculate();
                double v = vExp.calculate();

                if (Double.isNaN(u) || Double.isNaN(v)) {
                     hueRow.add(0.0);
                     brightnessRow.add(0.0); // แสดงเป็นสีดำถ้าคำนวณไม่ได้
                     continue;
                }

                // สร้างจำนวนเชิงซ้อน w จากผลลัพธ์ u และ v
                Complex w = new Complex(u, v);

                // คำนวณ Hue และ Brightness
                double hue = (w.getArgument() + Math.PI) / (2 * Math.PI);
                double brightness = 1 - Math.exp(-0.5 * w.abs());

                hueRow.add(hue);
                brightnessRow.add(brightness);
            }
            hueData.add(hueRow);
            brightnessData.add(brightnessRow);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("hue", hueData);
        data.put("brightness", brightnessData);
        return data;
    }

    public Map<String, Object> generateImplicitData(
            String expression,
            double xMin, double xMax, double yMin, double yMax, int resolution) {

        Argument x = new Argument("x");
        Argument y = new Argument("y");
        Expression exp = new Expression(expression, x, y);

        List<Double> xValues = new ArrayList<>();
        List<Double> yValues = new ArrayList<>();
        List<List<Double>> zValues = new ArrayList<>(); // z ในที่นี้คือค่าของ F(x, y)

        double xStep = (xMax - xMin) / resolution;
        double yStep = (yMax - yMin) / resolution;

        for (double currentY = yMin; currentY <= yMax; currentY += yStep) {
            yValues.add(currentY);
            List<Double> zRow = new ArrayList<>();
            y.setArgumentValue(currentY);

            for (double currentX = xMin; currentX <= xMax; currentX += xStep) {
                if (yValues.size() == 1) { // เพิ่มค่า x แค่ครั้งแรก
                    xValues.add(currentX);
                }
                x.setArgumentValue(currentX);
                double z = exp.calculate();
                zRow.add(Double.isNaN(z) ? null : z);
            }
            zValues.add(zRow);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("x", xValues);
        data.put("y", yValues);
        data.put("z", zValues); // ส่ง "แผนที่ความสูง" ทั้งหมดกลับไป
        return data;
    }
   
}