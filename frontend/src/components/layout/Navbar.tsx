"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* 🔴 タイトルを日本語に変更 */}
      <h1 className="font-semibold text-lg text-slate-800">社内ポータル</h1>

      <div className="flex items-center gap-4">
        {/* 🔴 表示を日本語に変更 */}
        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">管理者</span>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm font-bold"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}