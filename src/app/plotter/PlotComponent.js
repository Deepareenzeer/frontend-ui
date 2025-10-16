"use client";
import Plot from 'react-plotly.js';

// Component นี้มีหน้าที่แค่แสดงกราฟเท่านั้น
export default function PlotComponent({ data, layout }) {
  return (
    <Plot
      data={data}
      layout={layout}
      config={{ responsive: true }}
      className="w-full h-full"
    />
  );
}