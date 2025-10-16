"use client";
import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import styles from "./Converter.module.css";

export default function ConverterPage() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [readyNotice, setReadyNotice] = useState(false); // ✅ แจ้งเตือนเมื่อครบ 4 ช่อง

  const unitCategories: Record<string, string[]> = {
    length: ["meter", "kilometer", "centimeter", "millimeter", "mile", "yard", "foot", "inch"],
    mass: ["gram", "kilogram", "milligram", "pound", "ounce"],
    area: ["square_meter", "square_kilometer", "square_mile", "hectare", "acre"],
    time: ["second", "minute", "hour", "day"],
    speed: ["meter_per_second", "kilometer_per_hour", "mile_per_hour"],
    energy: ["joule", "kilojoule", "calorie", "kilocalorie"],
  };

  const unitMap: Record<string, string> = {
    meter: "m", kilometer: "km", centimeter: "cm", millimeter: "mm",
    mile: "mi", yard: "yd", foot: "ft", inch: "in",
    gram: "g", kilogram: "kg", milligram: "mg", pound: "lb", ounce: "oz",
    square_meter: "m²", square_kilometer: "km²", square_mile: "mi²", hectare: "ha", acre: "ac",
    second: "s", minute: "min", hour: "h", day: "d",
    meter_per_second: "m/s", kilometer_per_hour: "km/h", mile_per_hour: "mph",
    joule: "J", kilojoule: "kJ", calorie: "cal", kilocalorie: "kcal",
  };

  const unitMapToBackend: Record<string, string> = {
    // Length
    meter: "m",
    kilometer: "km",
    centimeter: "cm",
    millimeter: "mm",
    mile: "mi",
    yard: "yd",
    foot: "ft",
    inch: "in",
    
    // Mass
    gram: "g",
    kilogram: "kg",
    milligram: "mg",
    pound: "lb",
    ounce: "oz",
    
    // Area
    square_meter: "m2",
    square_kilometer: "km2",
    square_mile: "sq-mi",
    hectare: "ha",
    acre: "ac",
    
    // Time
    second: "s",
    minute: "min",
    hour: "h",
    day: "d",
    
    // Speed
    meter_per_second: "m/s",
    kilometer_per_hour: "km/h",
    mile_per_hour: "mph",
    
    // Energy
    joule: "J",
    kilojoule: "kJ",
    calorie: "cal",
    kilocalorie: "kcal",
  };

  const checkReasonable = (category: string, fromUnit: string, toUnit: string, value: number, convertedValue: number): string | null => {
    
    switch (category) {
      case "time":
        if (fromUnit === "hour" && toUnit === "day") {
          if (convertedValue > 30) return "Result seems too high for the input hours.";
          if (convertedValue < 0.01) return "Result seems too small for the input hours.";
        }
        break;

      case "length":
        if (convertedValue > 1e6) return "Result is unusually large for length.";
        if (convertedValue < 1e-6) return "Result is unusually small for length.";
        break;

      case "mass":
        if (convertedValue > 1e6) return "Result is unusually large for mass.";
        if (convertedValue < 1e-6) return "Result is unusually small for mass.";
        break;

      case "energy":
        if (convertedValue > 1e8) return "Result seems too high for energy.";
        if (convertedValue < 1e-3) return "Result seems too low for energy.";
        break;

      // เพิ่มหมวดอื่น ๆ ได้ตามต้องการ
    }

    return null; // ✅ ถ้าผลลัพธ์สมเหตุสมผล
  };

  // ✅ ถ้าใส่ครบ 4 ช่อง จะโชว์แจ้งเตือน
  useEffect(() => {
    if (category && fromUnit && toUnit && amount) {
      setReadyNotice(true);
      const timer = setTimeout(() => setReadyNotice(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [category, fromUnit, toUnit, amount]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setFromUnit("");
    setToUnit("");
    setAmount("");
    setResult("");
    setError("");
  };

  const handleConvert = async () => {
    if (!fromUnit || !toUnit) {
      setError("Please select both 'From' and 'To' units.");
      setResult("");
      return;
    }

    const valueStr = amount.trim();
    const normalizedValueStr = valueStr.replace(/^0+(?=\d)/, "");
    const valueNum = parseFloat(normalizedValueStr);

    if (!valueStr || isNaN(valueNum)) {
      setError("Please enter a valid number.");
      setResult("");
      return;
    }
    if (valueNum <= 0) {
      setError("Value must be greater than 0.");
      setResult("");
      return;
    }

    setError("");
    setResult("...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const response = await fetch(`${apiUrl}/unit/converter/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          fromUnit: unitMapToBackend[fromUnit],
          toUnit: unitMapToBackend[toUnit],
          value: valueNum,
        })
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const convertedValue = Number(data.result.toFixed(6));

      // ✅ ตรวจสอบค่าที่แปลงแล้ว "สมเหตุสมผล" สำหรับ Time
      if (category === "time" && fromUnit === "hour" && toUnit === "day") {
        if (convertedValue > 2) { // ตัวอย่าง ถ้า 20h กลายเป็น > 2 วัน => แจ้งเตือน
          setError("Hmm… the result seems too high for the given value.");
          setResult("");
          return;
        }
        if (convertedValue < 0.5) { // ถ้า 20h → 0.8d ปกติ แต่ถ้า <0.5d อาจผิด
          setError("The result seems too small compared to the input hours.");
          setResult("");
          return;
        }
      }

      setResult(convertedValue.toString());
    } catch (err: any) {
      setError(err.message || "Conversion failed.");
      setResult("");
    }
  };

  const handleSwapUnits = () => {
    setIsSwapping(true);

    setFromUnit(prevFrom => {
      const newFrom = toUnit;
      setToUnit(prevFrom); // swap ไปให้ toUnit
      return newFrom;
    });

    setTimeout(() => setIsSwapping(false), 500);
  };

  const handleClear = () => {
    handleCategoryChange({ target: { value: "length" } } as any);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Unit Converter</h1>

       
        <div className={styles.categoryGroup}>
          <label htmlFor="category" className={styles.mainLabel}>Category</label>
          <select id="category" value={category} onChange={handleCategoryChange} className={styles.categorySelect}>
            {Object.keys(unitCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
              if (!val.startsWith("0.") && val.length > 1) val = val.replace(/^0+/, "");
              if (parseFloat(val) === 0) val = "";
              setAmount(val);
              setResult("");
              setError("");
            }}
            className={styles.numberInput}
            placeholder="Enter amount to convert"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={styles.unitSelectFull} required>
            <option value="" disabled>Select a unit</option>
            {unitCategories[category].map((unit) => (
              <option key={unit} value={unit}>
                {`${unit.replace(/_/g, " ")} (${unitMap[unit]})`}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSwapUnits} className={`${styles.swapButton} ${isSwapping ? styles.rotate : ""}`}>
          <RefreshCcw size={20} />
        </button>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={styles.unitSelectFull} required>
            <option value="" disabled>Select a unit</option>
            {unitCategories[category].map((unit) => (
              <option key={unit} value={unit}>
                {`${unit.replace(/_/g, " ")} (${unitMap[unit]})`}
              </option>
            ))}
          </select>
        </div>

        {(result || error) && (
          <div className={styles.resultBox}>
            {error ? (
              <p className={styles.errorValue}>{error}</p>
            ) : (
              <>
                <p className={styles.resultAmount}>{result}</p>
                <p className={styles.resultUnit}>{toUnit ? unitMap[toUnit] : ""}</p>
              </>
            )}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button onClick={handleConvert} className={styles.convertButton}>Convert</button>
          <button onClick={handleClear} className={styles.resetButton}>Reset</button>
        </div>
      </div>
    </div>
  );
}
