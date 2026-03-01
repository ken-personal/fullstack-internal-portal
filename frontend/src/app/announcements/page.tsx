"use client";
import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  const fetchAll = async () => {
    const res = await fetch("http://localhost:3001/announcements");
    if (res.ok) setList(await res.json());
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:3001/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", content: "", author: "" });
    fetchAll();
  };

  return (
    <div style={{ padding: "40px", color: "#333" }}>
      <h1>📢 お知らせ管理</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px", margin: "20px 0" }}>
        <input style={inputS} placeholder="タイトル" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <textarea style={inputS} placeholder="内容" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
        <input style={inputS} placeholder="投稿者名" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
        <button style={{ padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "5px" }}>投稿する</button>
      </form>

      <div style={{ marginTop: "30px" }}>
        {list.map(a => (
          <div key={a.id} style={{ border: "1px solid #eee", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
            <h3>{a.title}</h3>
            <p style={{ fontSize: "14px", color: "#666" }}>{a.author} - {new Date(a.date).toLocaleString()}</p>
            <p style={{ marginTop: "10px" }}>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
const inputS = { padding: "10px", border: "1px solid #ddd", borderRadius: "4px" };