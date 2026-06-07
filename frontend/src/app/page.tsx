"use client";

import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";
import type { Announcement } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  if (loading) return (
    <div style={{ padding: "30px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* ヘッダースケルトン */}
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton className="h-8 w-52" />
        <div style={{ display: "flex", gap: "12px" }}>
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* KPIカードスケルトン × 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", borderTop: "6px solid #e2e8f0" }}>
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-9 w-36" />
          </div>
        ))}
      </div>

      {/* お知らせスケルトン */}
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <Skeleton className="h-5 w-28 mb-5" />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
        ))}
      </div>
    </div>
  );

  // 🔴 ここでデータを「安全に」数値化する
  // data が { totalSales: 100 } の形でも、[ { amount: 100 } ] の配列でも動くようにガード
  const sales = typeof data?.totalSales === 'number' ? data.totalSales : 0;
  const expenses = typeof data?.totalExpenses === 'number' ? data.totalExpenses : 0;
  const announcements = Array.isArray(data?.recentAnnouncements) ? data.recentAnnouncements : [];

  const profit = sales - expenses;

  return (
    <div style={{ padding: "30px", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#1e293b" }}>
      <header style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800" }}>🚀 経営ダッシュボード</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/sales" style={btnStyle("#10b981")}>売上入力</Link>
          <Link href="/expenses" style={btnStyle("#f43f5e")}>経費入力</Link>
        </div>
      </header>

      {/* 統計カードセクション */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle("#10b981")}>
          <p style={labelStyle}>売上合計</p>
          <h2 style={valueStyle}>¥{sales.toLocaleString()}</h2>
        </div>
        <div style={cardStyle("#f43f5e")}>
          <p style={labelStyle}>経費合計</p>
          <h2 style={valueStyle}>¥{expenses.toLocaleString()}</h2>
        </div>
        <div style={cardStyle(profit >= 0 ? "#3b82f6" : "#e11d48")}>
          <p style={labelStyle}>現在の利益</p>
          <h2 style={valueStyle}>¥{profit.toLocaleString()}</h2>
        </div>
      </div>

      {/* お知らせセクション */}
      <section style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>📢 お知らせ</h3>
        {announcements.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>現在、新しいお知らせはありません。</p>
        ) : (
          announcements.map((a: Announcement) => (
            <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
              <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</span>
              <span style={{ fontWeight: "600" }}>{a.title}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

// スタイル定義
const cardStyle = (borderColor: string) => ({
  background: "white",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  borderTop: `6px solid ${borderColor}`,
});
const labelStyle = { fontSize: "14px", color: "#64748b", fontWeight: "600", marginBottom: "4px" };
const valueStyle = { fontSize: "32px", fontWeight: "800", margin: "0" };
const btnStyle = (bg: string) => ({
  padding: "10px 20px",
  backgroundColor: bg,
  color: "white",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
});