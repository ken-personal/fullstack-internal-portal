"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaDollarSign,
  FaBullhorn,
  FaEnvelope,
  FaUser,
  FaMoneyBill,
  FaRobot,
  FaFolder,
  FaSearch,
  FaCreditCard,
} from "react-icons/fa";

type Role = "ADMIN" | "MANAGER" | "USER";

const allMenu = [
  { name: "ダッシュボード", href: "/dashboard", icon: FaChartBar, roles: ["ADMIN", "MANAGER", "USER"] },
  { name: "売上管理", href: "/sales", icon: FaDollarSign, roles: ["ADMIN", "MANAGER"] },
  { name: "経費管理", href: "/expenses", icon: FaMoneyBill, roles: ["ADMIN", "MANAGER"] },
  { name: "社内連絡", href: "/announcements", icon: FaBullhorn, roles: ["ADMIN", "MANAGER"] },
  { name: "お問い合わせ", href: "/inquiry", icon: FaEnvelope, roles: ["ADMIN", "MANAGER"] },
  { name: "社員名簿", href: "/profile", icon: FaUser, roles: ["ADMIN"] },
  { name: "AI アシスタント", href: "/chat", icon: FaRobot, roles: ["ADMIN", "MANAGER", "USER"] },
  { name: "資料管理", href: "/documents", icon: FaFolder, roles: ["ADMIN", "MANAGER", "USER"] },
  { name: "全文検索", href: "/search", icon: FaSearch, roles: ["ADMIN", "MANAGER", "USER"] },
  { name: "料金プラン", href: "/stripe", icon: FaCreditCard, roles: ["ADMIN", "MANAGER", "USER"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("USER");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as Role;
    if (savedRole) setRole(savedRole);
  }, []);

  const menu = allMenu.filter((item) => item.roles.includes(role));

  return (
    <aside
      style={{
        width: 240,
        background: "#0d0d0f",
        borderRight: "1px solid #1e1e24",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #1e1e24",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "white",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          S
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#e2e2e5",
            letterSpacing: "-0.01em",
          }}
        >
          社内システム
        </span>
      </div>

      <nav style={{ padding: "16px 10px", flex: 1 }}>
        <p
          style={{
            fontSize: 11,
            color: "#4a4a58",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0 8px 8px",
            margin: 0,
          }}
        >
          メニュー
        </p>
        {menu.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const isAI = item.href === "/chat";

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 2,
                background: active ? "#1e1e28" : "transparent",
                color: active ? "#e2e2e5" : "#7a7a8a",
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                textDecoration: "none",
                transition: "all 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#16161c";
                  e.currentTarget.style.color = "#c2c2cc";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#7a7a8a";
                }
              }}
            >
              <Icon
                size={15}
                style={{
                  color: active ? (isAI ? "#8b5cf6" : "#5e6ad2") : "#4a4a58",
                  flexShrink: 0,
                }}
              />
              <span>{item.name}</span>
              {isAI && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    background: "#2d1f4e",
                    color: "#8b5cf6",
                    padding: "2px 6px",
                    borderRadius: 999,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid #1e1e24",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#1e1e28",
            border: "1px solid #2a2a35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#7a7a8a",
            flexShrink: 0,
          }}
        >
          {role === "ADMIN" ? "管" : role === "MANAGER" ? "M" : "U"}
        </div>
        <div>
          <p style={{ fontSize: 13, color: "#c2c2cc", fontWeight: 500, margin: 0 }}>
            {role === "ADMIN" ? "管理者" : role === "MANAGER" ? "マネージャー" : "ユーザー"}
          </p>
          <p style={{ fontSize: 11, color: "#4a4a58", margin: 0 }}>
            {role}
          </p>
        </div>
      </div>
    </aside>
  );
}