"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  return (
    <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#e2e2e5", margin: 0 }}>
        お支払いが完了しました
      </h1>
      <p style={{ fontSize: 14, color: "#7a7a8a", marginTop: 12 }}>
        ご契約ありがとうございます。サービスをご利用いただけます。
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          marginTop: 32,
          padding: "12px 32px",
          background: "#5e6ad2",
          border: "none",
          borderRadius: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        ダッシュボードへ
      </button>
    </div>
  );
}
