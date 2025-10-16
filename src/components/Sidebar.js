"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import { Calculator, Table2, DollarSign, Sigma, Spline, Menu, X, Rabbit } from "lucide-react"; // 1. เพิ่มไอคอน Rabbit และเปลี่ยนไอคอนอื่นๆเล็กน้อย

const navLinks = [
  { name: "Calculator", href: "/", icon: Calculator },
  { name: "Unit Converter", href: "/converter", icon: Table2 },
  { name: "Currency", href: "/currency", icon: DollarSign },
  { name: "Electrical Calc", href: "/electrical", icon: Sigma },
  { name: "Graph Plotter", href: "/plotter", icon: Spline },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        {/* 2. เปลี่ยน Title และเพิ่มไอคอนกระต่าย */}
        <div className={styles.title}>
          
          <Image
            src="/images/a1.svg" // ระบุ path ไปยังไฟล์ Logo ใน public folder
            alt="BunnyCalc Logo"
            width={200} // กำหนดความกว้างของ Logo
            height={200} // กำหนดความสูงของ Logo (สำคัญสำหรับ Next/Image)
            className={styles.logoImage} 
          />
          
        </div>
        <nav>
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                  >
                    <LinkIcon className={styles.icon} />
                    <span className={styles.linkText}>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}