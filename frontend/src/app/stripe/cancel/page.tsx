"use client";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();
  return (
    <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>😔</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#e2e2e5", margin: 0 }}>
        お支払いがキャンセルされました
      </h1>
      <p style={{ fontSize: 14, color: "#7a7a8a", marginTop: 12 }}>
        いつでもプランをお選びいただけます。
      </p>
      <button
        onClick={() => router.push("/stripe")}
        style={{
          marginTop: 32,
          padding: "12px 32px",
          background: "#1e1e28",
          border: "1px solid #2a2a35",
          borderRadius: 8,
          color: "#c2c2cc",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        プラン選択に戻る
      </button>
    </div>
  );
}
