"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function InquiryPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSuccess(false);

    try {
      // バックエンドの /inquiries エンドポイントへ送信
      await api.post("/inquiries", { title, message });
      
      // 成功時の処理
      setIsSuccess(true);
      setTitle(""); // 入力欄をクリア
      setMessage("");

      // 5秒後に成功メッセージを自動で消す
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("送信エラー:", err);
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">📩 お問い合わせ</h1>

      {/* 成功時の通知バナー */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-4">
          <p className="flex items-center font-bold">
            <span className="mr-2">✅</span> 送信は完了しました。
          </p>
          <p className="text-sm">内容を確認次第、担当者よりご連絡いたします。</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            お問い合わせタイトル
          </label>
          <input
            type="text"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            placeholder="例: システムの操作方法について"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            メッセージ内容
          </label>
          <textarea
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all h-48"
            placeholder="こちらにお問い合わせ内容を詳しくご記入ください。"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            loading 
              ? "bg-slate-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {loading ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}