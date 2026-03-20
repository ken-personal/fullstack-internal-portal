"use client";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isAuthPage) {
      router.push("/login");
    } else if (token && isAuthPage) {
      router.push("/");
    }
    setIsAuthChecked(true);
  }, [pathname, isAuthPage, router]);

  if (!isAuthChecked) {
    return (
      <html lang="ja" className={cn("font-sans", geist.variable)}>
        <head>
          <title>読み込み中... | 社内システム</title>
        </head>
        <body className="bg-zinc-50"></body>
      </html>
    );
  }

  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <head>
        <title>社内管理システム</title>
        <meta name="description" content="経営情報・社員管理ポータル" />
      </head>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        {isAuthPage ? (
          // ログイン・サインアップ画面（サイドバーなし・全画面）
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          // メインコンテンツ（サイドバー＋ヘッダーあり）
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-6 md:p-10 flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
              <footer className="py-4 text-center text-xs text-zinc-400 bg-white border-t">
                © 2026 社内管理システム All Rights Reserved.
              </footer>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}