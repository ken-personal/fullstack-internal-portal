"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

// 🔵 ダミー社員50名分のデータを生成する関数
const generateDummyUsers = () => {
  const familyNames = ["佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤"];
  const firstNames = ["太郎", "次郎", "花子", "一郎", "結衣", "健太", "美咲", "直樹", "七海", "翔太"];
  const titles = ["営業部 課長", "開発部 エンジニア", "総務部", "人事部 マネージャー", "マーケティング部", "システム部 主任"];

  return Array.from({ length: 50 }).map((_, i) => ({
    id: `dummy-${i + 1}`,
    name: `${familyNames[i % 10]} ${firstNames[i % 10]}`,
    title: titles[i % titles.length],
    email: `staff${i + 1}@example.com`,
  }));
};

export default function ProfilePage() {
  const [me, setMe] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔵 ダミーデータをメモ化（再レンダリングで中身が変わらないように固定）
  const dummyUsers = useMemo(() => generateDummyUsers(), []);

  const fetchUsers = useCallback(async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = query 
      ? `http://localhost:3001/users/search?q=${encodeURIComponent(query)}`
      : "http://localhost:3001/users";
    
    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const dbData = await res.json();
        // 🔴 DBからのデータとダミーデータを合体させる
        const combined = [...dbData, ...dummyUsers];
        
        // 🔴 検索ワードがある場合はフィルタリング
        const filtered = query 
          ? combined.filter(u => u.name.includes(query) || u.title?.includes(query))
          : combined;

        setUsers(filtered);
      }
    } catch (err) {
      console.error("一覧取得エラー:", err);
      // エラー時もとりあえずダミーだけは出す
      setUsers(dummyUsers);
    }
  }, [dummyUsers]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setMe(userData);
          await fetchUsers(); 
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("初期化失敗:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchUsers]); 

  if (loading) return <div style={{ padding: "40px", color: "black", textAlign: "center" }}>データを読み込み中...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5", minHeight: "100vh", color: "black" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}>← ダッシュボードへ戻る</Link>
        </div>
        <h1 style={{ marginBottom: "20px" }}>社員検索システム</h1>
        
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", display: "flex", gap: "10px", marginBottom: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <input 
            type="text" 
            placeholder="名前や部署で検索..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} 
          />
          <button 
            onClick={() => fetchUsers(searchTerm)} 
            style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            検索
          </button>
        </div>

        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#e0e7ff", borderRadius: "8px", borderLeft: "5px solid #2563eb" }}>
          <strong>👤 ログインユーザー: {me?.name} さん</strong>（{me?.title || "役職未設定"}）
        </div>

        <h2>社員名簿 <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal" }}>({users.length}名)</span></h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {users.map((user) => (
            <div key={user.id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", border: user.id === me?.id ? "2px solid #2563eb" : "none" }}>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                {user.name} {user.id === me?.id && <span style={{ color: "#2563eb", fontSize: "12px" }}>(あなた)</span>}
              </div>
              <div style={{ color: "#666", margin: "5px 0" }}>{user.title || "部署未設定"}</div>
              <div style={{ fontSize: "12px", color: "#999" }}>{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}