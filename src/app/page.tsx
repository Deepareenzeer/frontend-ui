"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import React from "react";


const operators: string[] = ["+", "-", "*", "/", "^"];

// รายการข้อความน่ารักๆ สำหรับสุ่ม
const cuteMessages = [
  "I ❤️ U",
  "You're cute!",
  "Have a hoppy day!",
  "Keep smiling ^-^",
  "You got this!",
  "เก่งที่สุดเลย!",
  "ยิ้มหน่อยนะ",
  "สู้ๆ นะ"
];

export default function BunnyCalcPage() {
  const [expression, setExpression] = useState<string>("");
  const [display, setDisplay] = useState<string>("0");
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");

  useEffect(() => {
    // ป้องกันไม่ให้ข้อความน่ารักๆ ถูกเขียนทับทันที
    if (display !== "I ❤️ U" && !cuteMessages.includes(display) && display !== "Clean! ✨" && display !== "Pony งงแล้ว~") {
      setDisplay(expression || "0");
    }
  }, [expression, display]);

  const handleInput = (value: string) => {
    if (isResultDisplayed && !operators.includes(value) && value !== ".") {
      setExpression(value);
      setIsResultDisplayed(false);
      return;
    }
    setIsResultDisplayed(false);
    setExpression((prev) => {
      const lastChar = prev.slice(-1);
      if (operators.includes(value) && operators.includes(lastChar)) {
        return prev.slice(0, -1) + value;
      }
      if (prev === "0" && value !== ".") {
        return value;
      }
      return prev + value;
    });
  };

  const handleClear = () => {
    setExpression("");
    setIsResultDisplayed(false);
    setDisplay("Clean! ✨");
    setTimeout(() => {
      setDisplay("0");
    }, 800);
  };

  const handleDelete = () => {
    if (isResultDisplayed) {
      handleClear();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleAngleModeToggle = () => {
    setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"));
  };

  const handleEvaluate = async () => {
    if (!expression || isResultDisplayed) return;
    try {
      const openBrackets = (expression.match(/\(/g) || []).length;
      const closeBrackets = (expression.match(/\)/g) || []).length;
      const finalExpression = expression + ")".repeat(openBrackets - closeBrackets);
      const encodedExpression = encodeURIComponent(finalExpression);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://java-engine-1.onrender.com";
      const url = `${apiUrl}/calculator/evaluate?expression=${encodedExpression}&mode=${angleMode}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(await response.text() || "Error");
      const result: number = await response.json();
      const formattedResult = parseFloat(result.toPrecision(12));

      // Easter Egg
      if (formattedResult === 143) {
        setExpression("143");
        setDisplay("I ❤️ U");
      } else if (formattedResult === 777) {
        setExpression("777");
        setDisplay("Lucky day! ✨");
      } else {
        setExpression(formattedResult.toString());
      }
      
      setIsResultDisplayed(true);
    } catch (err) {
      setExpression("");
      setDisplay("Bunny งงแล้ว~");
      setIsResultDisplayed(true);
    }
  };

  const handleHeartClick = () => {
    const originalDisplay = display;
    const randomIndex = Math.floor(Math.random() * cuteMessages.length);
    const randomMessage = cuteMessages[randomIndex];
    setDisplay(randomMessage);
    setTimeout(() => {
      setDisplay(originalDisplay);
    }, 1500);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.displayFrame}>
          <div className={styles.displayBox}>
            <span className={styles.displayText}>{display}</span>
          </div>
        </div>
        <div className={styles.scientificGrid}>
          <CalcButton text={angleMode.toUpperCase()} onClick={handleAngleModeToggle} type="func" active />
          <CalcButton text="sin" onClick={() => handleInput("sin(")} type="func" />
          <CalcButton text="cos" onClick={() => handleInput("cos(")} type="func" />
          <CalcButton text="tan" onClick={() => handleInput("tan(")} type="func" />
          <CalcButton text="log" onClick={() => handleInput("log10(")} type="func" />
          <CalcButton text="ln" onClick={() => handleInput("ln(")} type="func" />
          <CalcButton text="π" onClick={() => handleInput("pi")} type="func" />
          <CalcButton text="e" onClick={() => handleInput("e")} type="func" />
          <CalcButton text="x²" onClick={() => handleInput("sqr(")} type="func" />
          <CalcButton text="xʸ" onClick={() => handleInput("^")} type="func" />
          <CalcButton text="√" onClick={() => handleInput("sqrt(")} type="func" />
          <CalcButton text="(" onClick={() => handleInput("(")} type="func" />
          <CalcButton text=")" onClick={() => handleInput(")")} type="func" />
          <CalcButton text="❤️" onClick={handleHeartClick} type="special" />
        </div>
        <div className={styles.buttonGrid}>
          <CalcButton text="AC" type="clear" onClick={handleClear} />
          <CalcButton text="DEL" type="clear" onClick={handleDelete} />
          <CalcButton text="%" type="op" onClick={() => handleInput("%")} />
          <CalcButton text="÷" type="op" onClick={() => handleInput("/")} />
          <CalcButton text="7" onClick={() => handleInput("7")} />
          <CalcButton text="8" onClick={() => handleInput("8")} />
          <CalcButton text="9" onClick={() => handleInput("9")} />
          <CalcButton text="×" type="op" onClick={() => handleInput("*")} />
          <CalcButton text="4" onClick={() => handleInput("4")} />
          <CalcButton text="5" onClick={() => handleInput("5")} />
          <CalcButton text="6" onClick={() => handleInput("6")} />
          <CalcButton text="−" type="op" onClick={() => handleInput("-")} />
          <CalcButton text="1" onClick={() => handleInput("1")} />
          <CalcButton text="2" onClick={() => handleInput("2")} />
          <CalcButton text="3" onClick={() => handleInput("3")} />
          <CalcButton text="+" type="op" onClick={() => handleInput("+")} />
          <CalcButton text="0" onClick={() => handleInput("0")} extra="col-span-2" />
          <CalcButton text="." onClick={() => handleInput(".")} />
          <CalcButton text="=" type="equals" onClick={handleEvaluate} />
        </div>
      </div>
    </div>
  );
}

interface CalcButtonProps {
  text: string;
  onClick: () => void;
  type?: "default" | "op" | "clear" | "func" | "equals" | "special";
  active?: boolean;
  extra?: string;
}

function CalcButton({ text, onClick, type = "default", active, extra }: CalcButtonProps) {
  const handleClick = () => { onClick(); };
  const baseClass = `${styles.calcButton} ${extra || ""}`;
  let typeClass = styles.calcDefault;
  if (type === "op") typeClass = styles.calcOp;
  else if (type === "clear") typeClass = styles.calcClear;
  else if (type === "func") typeClass = styles.calcFunc;
  else if (type === "equals") typeClass = styles.calcEquals;
  else if (type === "special") typeClass = styles.calcSpecial;
  const activeClass = active ? styles.activeRing : "";

  return (
    <button onClick={handleClick} className={`${baseClass} ${typeClass} ${activeClass}`}>
      <span>{text}</span>
    </button>
  );
}