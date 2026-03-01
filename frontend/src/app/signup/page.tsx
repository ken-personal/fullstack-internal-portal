"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");    // 追加
  const [title, setTitle] = useState("");  // 追加
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, title }),
      });

      if (res.ok) {
        alert("ユーザー登録が完了しました！ログインしてください。");
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "登録に失敗しました。");
      }
    } catch (err) {
      setError("サーバーに接続できませんでした。");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">新規社員登録</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="山田 太郎"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">部署・役職</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="開発部 / マネージャー"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="test@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            アカウントを作成
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              ログインはこちら
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}