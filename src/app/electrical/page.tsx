"use client";
import { useState } from "react";
import styles from "./Electrical.module.css";

export default function ElectricalPage() {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");
  const [power, setPower] = useState("");
  const [results, setResults] = useState<{
    voltage?: number;
    current?: number;
    resistance?: number;
    power?: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    setError("");
    setResults(null);

    // นับจำนวนช่องที่กรอก
    const filledCount =
      (voltage.trim() !== "" ? 1 : 0) +
      (current.trim() !== "" ? 1 : 0) +
      (resistance.trim() !== "" ? 1 : 0) +
      (power.trim() !== "" ? 1 : 0);

    // แจ้งเตือนถ้าใส่ครบ 4 ช่อง
    if (filledCount === 4) {
      setError("Please enter only two values to calculate the others.");
      return;
    }

    const params = new URLSearchParams({ v: voltage, i: current, r: resistance, p: power }).toString();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${apiUrl}/api/electrical/calculate?${params}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearFields = () => {
    setVoltage("");
    setCurrent("");
    setResistance("");
    setPower("");
    setResults(null);
    setError("");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Ohm&#39;s Law & Power Calculator</h1>
        <p className={styles.subtitle}>Enter any two values to calculate the others.</p>

        {/* --- ส่วนที่แก้ไข --- */}
        <div className={styles.inputSection}>
          <div className={styles.groupTitle}>Voltage & Current</div>
          <div className={styles.inputRow}>
            <InputField label="Voltage (V)" value={voltage} onChange={setVoltage} />
            <InputField label="Current (A)" value={current} onChange={setCurrent} />
          </div>

          <div className={styles.groupTitle}>Resistance & Power</div>
          <div className={styles.inputRow}>
            <InputField label="Resistance (Ω)" value={resistance} onChange={setResistance} />
            <InputField label="Power (W)" value={power} onChange={setPower} />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.calculateButton} onClick={handleCalculate}>
            Calculate
          </button>
          <button className={styles.resetButton} onClick={clearFields}>
            Reset
          </button>
        </div>

        {(error || results) && (
          <div className={styles.resultBox}>
            {error ? (
              <p className={styles.errorValue}>{error}</p>
            ) : (
              <>
                <h2 className={styles.resultTitle}>Results</h2>
                <div className={styles.resultGrid}>
                  <ResultCard label="Voltage" value={results?.voltage} unit="V" />
                  <ResultCard label="Current" value={results?.current} unit="A" />
                  <ResultCard label="Resistance" value={results?.resistance} unit="Ω" />
                  <ResultCard label="Power" value={results?.power} unit="W" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components (ไม่ต้องแก้ไข) ---
const InputField = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void; }) => (
  <div className={styles.inputWrapper}>
    <label className={styles.inputLabel}>{label}</label>
    <input
      type="text" // เปลี่ยนจาก number เป็น text เพื่อจัดการ realtime
      value={value}
      onChange={(e) => {
        let val = e.target.value;

        // ลบตัวอักษรที่ไม่ใช่ 0-9 หรือ .
        val = val.replace(/[^0-9.]/g, "");

        // ถ้ามีหลายจุด ให้เหลือจุดแรก
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts.slice(1).join("");
        }

        // ลบเลขนำศูนย์ ถ้าไม่ใช่กรณี "0."
        if (!val.startsWith("0.") && val.length > 1) {
          val = val.replace(/^0+/, "");
        }

        // ป้องกันค่า 0
        if (parseFloat(val) === 0) val = "";

        onChange(val);
      }}
      placeholder="Enter value"
      className={styles.inputBox}
    />
  </div>
);

const ResultCard = ({ label, value, unit }: { label: string; value?: number; unit: string; }) => (
  <div className={styles.resultCard}>
    <p className={styles.resultLabel}>{label}</p>
    <p className={styles.resultValue}>
      {value !== undefined ? `${value.toFixed(3)} ${unit}` : "N/A"}
    </p>
  </div>
);