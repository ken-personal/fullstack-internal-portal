"use client";
import { useRouter, usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "ダッシュボード",
  "/sales": "売上管理",
  "/expenses": "経費管理",
  "/announcements": "社内連絡",
  "/inquiry": "お問い合わせ",
  "/profile": "社員名簿",
  "/chat": "AI アシスタント",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "社内システム";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header
      style={{
        height: 48,
        background: "#0d0d0f",
        borderBottom: "1px solid #1e1e24",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e2e5" }}>
          {title}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: "#7a7a8a",
            background: "#1a1a1e",
            border: "1px solid #2a2a30",
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          管理者
        </span>
        <button
          onClick={handleLogout}
          style={{
            fontSize: 12,
            color: "#e2e2e5",
            background: "#1e1e28",
            border: "1px solid #2a2a35",
            padding: "4px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2a2a35";
            e.currentTarget.style.borderColor = "#3a3a45";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1e1e28";
            e.currentTarget.style.borderColor = "#2a2a35";
          }}
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}