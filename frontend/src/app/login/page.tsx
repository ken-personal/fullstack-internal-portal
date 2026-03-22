"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const token = data.access_token || data.token;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", data.user?.role ?? "USER");
          toast.success("ログインしました 👋");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 800);
        } else {
          setError("サーバーエラー：認証トークンが取得できませんでした。");
        }
      } else {
        setError(data.message || "メールアドレスかパスワードが正しくありません。");
      }
    } catch (err) {
      toast.error("サーバーに接続できませんでした。");
      setError("サーバーに接続できませんでした。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-zinc-900 font-bold text-sm">IP</span>
          </div>
          <span className="font-semibold text-lg">Internal Portal</span>
        </div>
        <div className="space-y-4">
          <blockquote className="text-2xl font-light leading-relaxed text-zinc-100">
            "チームの情報を一元管理し、<br />
            業務効率を最大化する。"
          </blockquote>
          <p className="text-zinc-400 text-sm">
            売上・経費・問い合わせ・社員情報をリアルタイムで把握
          </p>
        </div>
        <div className="text-zinc-500 text-xs">
          © 2025 Internal Portal. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-8 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span className="font-semibold text-lg text-zinc-900">Internal Portal</span>
          </div>

          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-zinc-900">
                ログイン
              </CardTitle>
              <CardDescription className="text-zinc-500">
                メールアドレスとパスワードを入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-zinc-200 focus:border-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    パスワード
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-zinc-200 focus:border-zinc-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-zinc-500">
            アカウントをお持ちでないですか？{" "}
            <Link
              href="/signup"
              className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
            >
              新規登録はこちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}