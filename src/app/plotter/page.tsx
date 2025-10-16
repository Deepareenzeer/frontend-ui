"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./pp.module.css"; // ตรวจสอบว่าชื่อไฟล์ CSS ถูกต้อง

// Dynamic import แบบไม่มี type checking
const Plot = dynamic(() => import("react-plotly.js"), { 
  ssr: false,
  loading: () => <p>Loading chart...</p>
}) as any;

export default function PlotterPage() {
  const [plotType, setPlotType] = useState("2d");

  // States
  const [expression2d, setExpression2d] = useState("");
  const [xMin2d, setXMin2d] = useState("");
  const [xMax2d, setXMax2d] = useState("");

  const [implicitExpression, setImplicitExpression] = useState("");
  const [xMinImplicit, setXMinImplicit] = useState("");
  const [xMaxImplicit, setXMaxImplicit] = useState("");
  const [yMinImplicit, setYMinImplicit] = useState("");
  const [yMaxImplicit, setYMaxImplicit] = useState("");

  const [expression3d, setExpression3d] = useState("");
  const [uExpression, setUExpression] = useState("");
  const [vExpression, setVExpression] = useState("");

  const [plotData, setPlotData] = useState<any[]>([]);
  const [plotLayout, setPlotLayout] = useState<any>({
    title: {
      text: "BunnyCalc Plotter"
    },
    paper_bgcolor: "#fce7f3",
    plot_bgcolor: "#fef3c7",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetFields = () => {
    setExpression2d("");
    setXMin2d("");
    setXMax2d("");
    setImplicitExpression("");
    setXMinImplicit("");
    setXMaxImplicit("");
    setYMinImplicit("");
    setYMaxImplicit("");
    setExpression3d("");
    setUExpression("");
    setVExpression("");
    setPlotData([]);
    setError("");
    setPlotLayout({
      title: {
        text: "BunnyCalc Plotter"
      },
      paper_bgcolor: "#fce7f3",
      plot_bgcolor: "#fef3c7",
    });
  };

  const handlePlot2D = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ 
        expression: expression2d, 
        min: xMin2d, 
        max: xMax2d 
      });
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const response = await fetch(`${apiUrl}/plotter/2d?${params.toString()}`);
      if (!response.ok) throw new Error("Invalid expression or range");
      const data = await response.json();
      setPlotData([
        {
          x: data.map((p: any) => p.x),
          y: data.map((p: any) => p.y),
          type: "scatter",
          mode: "lines",
          line: { color: "#a855f7", width: 4 },
        },
      ]);
      setPlotLayout({
        title: {
          text: `Graph of y = ${expression2d}`
        },
        paper_bgcolor: "#fce7f3",
        plot_bgcolor: "#fef3c7",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPlotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlotImplicit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const params = new URLSearchParams({ 
        expression: implicitExpression,
        xMin: xMinImplicit,
        xMax: xMaxImplicit,
        yMin: yMinImplicit,
        yMax: yMaxImplicit
      });
      const response = await fetch(`${apiUrl}/plotter/implicit?${params.toString()}`); 
      if (!response.ok) throw new Error("Invalid implicit expression");
      const data = await response.json();
      setPlotData([
        {
          x: data.x,
          y: data.y,
          z: data.z,
          type: "contour",
          contours: { coloring: "lines", start: 0, end: 0, size: 0 },
          line: { color: "#ef4444", width: 4 },
        },
      ]);
      setPlotLayout({
        title: {
          text: `Graph of ${implicitExpression} = 0`
        },
        paper_bgcolor: "#fce7f3",
        plot_bgcolor: "#fef3c7",
        xaxis: { scaleanchor: "y", scaleratio: 1 },
        yaxis: { scaleratio: 1 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPlotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlot3D = async () => {
    setIsLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const params = new URLSearchParams({ expression: expression3d });
      const response = await fetch(`${apiUrl}/plotter/3d?${params.toString()}`); 
      if (!response.ok) throw new Error("Invalid expression");
      const data = await response.json();
      setPlotData([{ 
        x: data.x, 
        y: data.y, 
        z: data.z, 
        type: "surface", 
        colorscale: "Viridis" 
      }]);
      setPlotLayout({
        title: {
          text: `Graph of z = ${expression3d}`
        },
        paper_bgcolor: "#fce7f3",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPlotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlotComplex = async () => {
    setIsLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const params = new URLSearchParams({ uExpression, vExpression });
      const response = await fetch(`${apiUrl}/plotter/complex?${params.toString()}`);
      if (!response.ok) throw new Error("Invalid complex function expressions");
      const data = await response.json();
      setPlotData([{ 
        z: data.brightness, 
        type: "heatmap", 
        colorscale: "hsv", 
        showscale: false 
      }]);
      setPlotLayout({
        title: {
          text: "Complex Plane Plot"
        },
        paper_bgcolor: "#fce7f3",
        xaxis: { visible: false },
        yaxis: { visible: false },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPlotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Graph Plotter</h1>

      <div className={styles.tabsContainer}>
        <button 
          onClick={() => setPlotType("2d")} 
          className={`${styles.tabButton} ${plotType === "2d" ? styles.tabActive : ""}`}
        >
          2D Explicit
        </button>
        <button 
          onClick={() => setPlotType("implicit")} 
          className={`${styles.tabButton} ${plotType === "implicit" ? styles.tabActive : ""}`}
        >
          2D Implicit
        </button>
        <button 
          onClick={() => setPlotType("3d")} 
          className={`${styles.tabButton} ${plotType === "3d" ? styles.tabActive : ""}`}
        >
          3D
        </button>
        <button 
          onClick={() => setPlotType("complex")} 
          className={`${styles.tabButton} ${plotType === "complex" ? styles.tabActive : ""}`}
        >
          Complex
        </button>
        <button onClick={resetFields} className={styles.resetButton}>Reset</button>
      </div>

      {plotType === "2d" && (
        <div className={styles.inputGroup}>
          <span className={styles.inputLabel}>y =</span>
          <input 
            type="text" 
            value={expression2d} 
            onChange={(e) => setExpression2d(e.target.value)} 
            className={styles.inputField} 
            placeholder="e.g., x^2" 
          />
          <input 
            type="number" 
            value={xMin2d} 
            onChange={(e) => setXMin2d(e.target.value)} 
            className={styles.rangeInput} 
            placeholder="x min e.g., -10" 
          />
          <input 
            type="number" 
            value={xMax2d} 
            onChange={(e) => setXMax2d(e.target.value)} 
            className={styles.rangeInput} 
            placeholder="x max e.g., 10" 
          />
          <button onClick={handlePlot2D} className={styles.plotButton}>Plot</button>
        </div>
      )}

      {plotType === "implicit" && (
        <div className={styles.implicitInputContainer}>
          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>Equation:</span>
            <input 
              type="text" 
              value={implicitExpression} 
              onChange={(e) => setImplicitExpression(e.target.value)} 
              className={styles.inputField} 
              placeholder="e.g., x^2 + y^2 - 16" 
            />
            <span className={styles.inputLabel}>= 0</span>
            <button onClick={handlePlotImplicit} className={styles.plotButton}>Plot</button>
          </div>
          <div className={styles.rangeGroup}>
            <input 
              type="number" 
              value={xMinImplicit} 
              onChange={e => setXMinImplicit(e.target.value)} 
              className={styles.rangeInput} 
              placeholder="x min e.g., -10" 
            />
            <input 
              type="number" 
              value={xMaxImplicit} 
              onChange={e => setXMaxImplicit(e.target.value)} 
              className={styles.rangeInput} 
              placeholder="x max e.g., 10" 
            />
            <input 
              type="number" 
              value={yMinImplicit} 
              onChange={e => setYMinImplicit(e.target.value)} 
              className={styles.rangeInput} 
              placeholder="y min e.g., -10" 
            />
            <input 
              type="number" 
              value={yMaxImplicit} 
              onChange={e => setYMaxImplicit(e.target.value)} 
              className={styles.rangeInput} 
              placeholder="y max e.g., 10" 
            />
          </div>
        </div>
      )}

      {plotType === "3d" && (
        <div className={styles.inputGroup}>
          <span className={styles.inputLabel}>z =</span>
          <input 
            type="text" 
            value={expression3d} 
            onChange={(e) => setExpression3d(e.target.value)} 
            className={styles.inputField} 
            placeholder="e.g., sin(x)*cos(y)" 
          />
          <button onClick={handlePlot3D} className={styles.plotButton}>Plot</button>
        </div>
      )}

      {plotType === "complex" && (
        <div className={styles.complexInputContainer}>
          <p className={styles.complexNote}>
            Enter the real part u(x,y) and imaginary part v(x,y) of f(z).
          </p>
          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>u(x,y) =</span>
            <input 
              type="text" 
              value={uExpression} 
              onChange={(e) => setUExpression(e.target.value)} 
              className={styles.inputField} 
              placeholder="e.g., u = x^2-y^2" 
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>v(x,y) =</span>
            <input 
              type="text" 
              value={vExpression} 
              onChange={(e) => setVExpression(e.target.value)} 
              className={styles.inputField} 
              placeholder="e.g., v = 2*x*y" 
            />
            <button onClick={handlePlotComplex} className={styles.plotButton}>Plot</button>
          </div>
        </div>
      )}

      <div className={styles.plotArea}>
        {isLoading ? (
          <p className={styles.message}>Loading...</p>
        ) : error ? (
          <p className={`${styles.message} ${styles.error}`}>{error}</p>
        ) : plotData.length > 0 ? (
          <Plot 
            data={plotData} 
            layout={plotLayout} 
            config={{ responsive: true }} 
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p className={styles.message}>Enter an equation and click Plot</p>
        )}
      </div>
    </div>
  );
}