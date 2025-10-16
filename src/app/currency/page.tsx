"use client";
import { useState, useEffect, useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import Select from 'react-select';
import styles from "./Currency.module.css"; // ตรวจสอบว่าชื่อไฟล์ CSS ถูกต้อง

interface CurrencyOption {
  value: string;
  label: string;
}

export default function CurrencyPage() {
  // ✅ 1. เปลี่ยนค่าเริ่มต้นให้เป็นค่าว่าง
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyOption | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrencyOption | null>(null);
  
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");
  const [rateInfo, setRateInfo] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://java-engine-1.onrender.com/currency/currencies");
        if (!response.ok) throw new Error("Could not connect to currency service.");
        const data = await response.json();
        setCurrencies(Object.keys(data));
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCurrencies();
  }, []);

  const currencyOptions = useMemo(() =>
    currencies.map(c => ({ value: c, label: c })),
    [currencies]
  );

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = async () => {
    // ✅ 2. เพิ่มการตรวจสอบว่าผู้ใช้เลือกสกุลเงินครบหรือยัง
    if (!fromCurrency || !toCurrency) {
      setError("Please select both 'From' and 'To' currencies.");
      return;
    }

    const valueNum = parseFloat(amount);
    if (!amount || isNaN(valueNum) || valueNum <= 0) {
      setError("Please enter a valid amount.");
      setResult("");
      return;
    }
    setError("");
    setResult("Converting...");
    setRateInfo("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const url = `${apiUrl}/currency/convert?from=${fromCurrency.value}&to=${toCurrency.value}&amount=${valueNum}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(await response.text());
      const data: { convertedAmount: number; rate: number } = await response.json();
      setResult(data.convertedAmount.toFixed(2));
      setRateInfo(`1 ${fromCurrency.label} = ${data.rate.toFixed(4)} ${toCurrency.label}`);
    } catch (err: any) {
      setError(err.message);
      setResult("");
    }
  };

  const handleClear = () => {
    // ✅ 3. ปรับฟังก์ชัน Reset ให้เคลียร์ทุกอย่างเป็นค่าว่าง
    setAmount("");
    setFromCurrency(null);
    setToCurrency(null);
    setResult("");
    setError("");
    setRateInfo("");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Currency Converter</h1>
        <div className={styles.converterBody}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Amount</label>
              <input
                type="text" // เปลี่ยนจาก number เป็น text เพื่อจัดการ realtime
                value={amount}
                onChange={(e) => {
                  let val = e.target.value;

                  // ลบทุกตัวอักษรที่ไม่ใช่ 0-9 หรือ .
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
            <Select
              value={fromCurrency}
              onChange={(option) => setFromCurrency(option)}
              options={currencyOptions}
              styles={customSelectStyles}
              className={styles.searchableSelect}
              placeholder="Select a currency" // ✅ 4. เพิ่ม Placeholder
              isClearable // อนุญาตให้ผู้ใช้กด x เพื่อล้างค่า
            />
          </div>
          <button onClick={handleSwap} className={styles.swapButton}>
            <RefreshCcw size={24} />
          </button>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>To</label>
            <Select
              value={toCurrency}
              onChange={(option) => setToCurrency(option)}
              options={currencyOptions}
              styles={customSelectStyles}
              className={styles.searchableSelect}
              placeholder="Select a currency" // ✅ 4. เพิ่ม Placeholder
              isClearable
            />
          </div>
        </div>
        {(result || error) && (
          <div className={styles.resultBox}>
            {error ? (
              <p className={styles.errorValue}>{error}</p>
            ) : (
              <>
                <p className={styles.resultAmount}>{result}</p>
                {/* ตรวจสอบ toCurrency ก่อนแสดง label */}
                <p className={styles.resultCurrency}>{toCurrency?.label}</p>
              </>
            )}
          </div>
        )}
        {rateInfo && !error && <p className={styles.rateInfo}>{rateInfo}</p>}
        <div className={styles.buttonGroup}>
          <button onClick={handleConvert} className={styles.convertButton}>
            Convert
          </button>
          <button onClick={handleClear} className={styles.resetButton}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 สไตล์สำหรับ react-select ให้เข้ากับธีม
const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    background: '#fef9c3',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    padding: '0.35rem',
    fontSize: '1.1rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#a855f7',
    },
  }),
  // ✅ 5. เพิ่มสไตล์ให้ Placeholder ดูสวยงาม
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af', // สีเทาจางๆ
  }),
  option: (provided: any, state: { isFocused: boolean; }) => ({
    ...provided,
    background: state.isFocused ? '#f3e8ff' : 'white',
    color: '#581c87',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#581c87',
  }),
};