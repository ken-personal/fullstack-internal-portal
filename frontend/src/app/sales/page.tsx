"use client";
import { useEffect, useState } from "react";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", amount: 0, user: "", department: "", date: "" });

  const fetchSales = async () => {
    const res = await fetch("http://localhost:3001/sales");
    if (res.ok) setSales(await res.json());
  };

  useEffect(() => { fetchSales(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:3001/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", amount: 0, user: "", department: "", date: "" });
    fetchSales();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`http://localhost:3001/sales/${id}`, { method: "DELETE" });
    fetchSales();
  };

  return (
    <div style={{ padding: "40px", color: "#333" }}>
      <h1>📈 売上管理</h1>
      
      {/* 入力エリア */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", margin: "20px 0", flexWrap: "wrap" }}>
        <input style={inputS} type="text" placeholder="案件名" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input style={inputS} type="number" placeholder="金額" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} required />
        <input style={inputS} type="text" placeholder="担当者" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required />
        <input style={inputS} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        <button style={{ padding: "10px 20px", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "5px" }}>追加</button>
      </form>

      {/* 一覧テーブル */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={thS}>日付</th><th style={thS}>項目</th><th style={thS}>担当</th><th style={thS}>金額</th><th style={thS}>操作</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdS}>{new Date(s.date).toLocaleDateString()}</td>
              <td style={tdS}>{s.title}</td>
              <td style={tdS}>{s.user}</td>
              <td style={tdS}>¥{s.amount.toLocaleString()}</td>
              <td style={tdS}><button onClick={() => handleDelete(s.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputS = { padding: "8px", border: "1px solid #ddd", borderRadius: "4px" };
const thS = { padding: "12px", textAlign: "left" as const };
const tdS = { padding: "12px" };