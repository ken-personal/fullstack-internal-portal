"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("ログイン試行中...");
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ バックエンドのプロパティ名がどちらでも対応できるようにする
        const token = data.access_token || data.token;

        if (token) {
          console.log("ログイン成功、トークンを保存します");
          localStorage.setItem("token", token);
          
          // ✅ ログイン後の遷移先をトップページ（/）に変更
          window.location.href = "/"; 
        } else {
          console.error("トークンがレスポンスに含まれていません:", data);
          setError("サーバーエラー：認証トークンが取得できませんでした。");
        }
      } else {
        console.error("ログイン失敗:", data.message);
        setError(data.message || "メールアドレスかパスワードが正しくありません。");
      }
    } catch (err) {
      console.error("通信エラー:", err);
      setError("サーバーに接続できませんでした。バックエンドが起動しているか確認してください。");
    }
  };

  return (
    <div style={{ padding: "100px", textAlign: "center", color: "black", backgroundColor: "white", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>社員ログイン</h1>
      
      {error && (
        <div style={{ color: "red", backgroundColor: "#fee2e2", padding: "10px", borderRadius: "4px", width: "300px", margin: "0 auto 20px" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "300px", margin: "0 auto", gap: "10px" }}>
        <input 
          type="email" 
          placeholder="メールアドレス" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", color: "black", fontSize: "16px" }} 
        />
        <input 
          type="password" 
          placeholder="パスワード" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", color: "black", fontSize: "16px" }} 
        />
        <button type="submit" style={{ padding: "12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "16px", marginTop: "10px" }}>
          ログイン
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <p style={{ color: "#666", fontSize: "14px" }}>
          アカウントをお持ちでないですか？{" "}
          <Link href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>
            新規登録（サインアップ）はこちら
          </Link>
        </p>
      </div>
    </div>
  );
}