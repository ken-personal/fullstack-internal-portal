"use client";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

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
        <body style={{ background: "#0d0d0f" }}></body>
      </html>
    );
  }

  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <head>
        <title>社内管理システム</title>
        <meta name="description" content="経営情報・社員管理ポータル" />
      </head>
      <body style={{ background: "#0d0d0f", color: "#e2e2e5" }} className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e1e28",
              color: "#e2e2e5",
              border: "1px solid #2a2a35",
              fontSize: "13px",
            },
          }}
        />
        {isAuthPage ? (
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main
                style={{
                  padding: "24px 32px",
                  flex: 1,
                  overflowY: "auto",
                  background: "#0d0d0f",
                }}
              >
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
              <footer
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: 11,
                  color: "#4a4a58",
                  background: "#0d0d0f",
                  borderTop: "1px solid #1e1e24",
                }}
              >
                © 2026 社内管理システム All Rights Reserved.
              </footer>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}