"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    amount: 0,
    user: "",
    department: "",
    date: new Date().toISOString().split("T")[0], // 初期値に今日の日付
  });

  // 1. データの取得
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:3001/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("経費データの取得に失敗しました:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 2. 新規登録
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", amount: 0, user: "", department: "", date: new Date().toISOString().split("T")[0] });
        fetchExpenses(); // 一覧を再更新
      }
    } catch (err) {
      alert("登録に失敗しました");
    }
  };

  // 3. 削除
  const handleDelete = async (id: number) => {
    if (!confirm("この経費データを削除してもよろしいですか？")) return;
    try {
      const res = await fetch(`http://localhost:3001/expenses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#fff5f5", minHeight: "100vh", color: "#1e293b" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#c53030" }}>💸 経費管理</h1>
          <Link href="/" style={{ textDecoration: "none", color: "#64748b", fontWeight: "bold" }}>← ダッシュボードに戻る</Link>
        </header>

        {/* 入力フォームカード */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "20px" }}>新規経費登録</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <input style={inputS} type="text" placeholder="費目（例: 交通費）" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input style={inputS} type="number" placeholder="金額" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} required />
            <input style={inputS} type="text" placeholder="申請者" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required />
            <input style={inputS} type="text" placeholder="部署名" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
            <input style={inputS} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            <button style={{ ...btnS, backgroundColor: "#ef4444" }}>登録する</button>
          </form>
        </div>

        {/* 履歴テーブル */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#fee2e2" }}>
              <tr>
                <th style={thS}>日付</th>
                <th style={thS}>費目</th>
                <th style={thS}>申請者</th>
                <th style={thS}>部署</th>
                <th style={thS}>金額</th>
                <th style={thS}>操作</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdS}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={tdS}>{exp.title}</td>
                  <td style={tdS}>{exp.user}</td>
                  <td style={tdS}>{exp.department}</td>
                  <td style={{ ...tdS, fontWeight: "bold", color: "#c53030" }}>¥{exp.amount.toLocaleString()}</td>
                  <td style={tdS}>
                    <button onClick={() => handleDelete(exp.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "14px" }}>削除</button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>データがありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputS = { padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" };
const btnS = { padding: "12px", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const thS = { padding: "15px", textAlign: "left" as const, fontSize: "14px", color: "#9b2c2c" };
const tdS = { padding: "15px", fontSize: "14px" };