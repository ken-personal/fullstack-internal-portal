"use client";

import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ※メタデータは 'use client' があるファイルには直接書けないため、
// 実際のタブ名は page.tsx 側が優先されますが、構造を整えます。

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ログイン・新規登録画面の判定
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // 認証チェック：トークンがなければログインへ、あればトップへ
    if (!token && !isAuthPage) {
      router.push("/login");
    } else if (token && isAuthPage) {
      router.push("/");
    }

    setIsAuthChecked(true);
  }, [pathname, isAuthPage, router]);

  // 認証チェックが終わるまで真っ白な画面を防ぐ（ローディング状態）
  if (!isAuthChecked) {
    return (
      <html lang="ja">
        <head>
          <title>読み込み中... | 社内システム</title>
        </head>
        <body className="bg-slate-50"></body>
      </html>
    );
  }

  return (
    <html lang="ja">
      <head>
        <title>社内管理システム</title>
        <meta name="description" content="経営情報・社員管理ポータル" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {isAuthPage ? (
          // ログイン・サインアップ画面（サイドバーなし）
          <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            {children}
          </main>
        ) : (
          // メインコンテンツ（サイドバー ＋ ヘッダーあり）
          <div className="flex min-h-screen">
            {/* サイドバー：社内システム */}
            <Sidebar />
            
            <div className="flex-1 flex flex-col">
              {/* ヘッダー：社内ポータル */}
              <Navbar />
              
              {/* 各ページのコンテンツ */}
              <main className="p-6 md:p-10 flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>

              {/* フッター（必要であれば） */}
              <footer className="py-4 text-center text-xs text-slate-400 bg-white border-t">
                © 2026 社内管理システム All Rights Reserved.
              </footer>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}