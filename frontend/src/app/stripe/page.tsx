"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
}

export default function StripePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const API = "http://localhost:3001";

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/stripe/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error("プランの取得に失敗しました");
    }
  };

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: planId, userId: "user_1" }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("決済セッションの作成に失敗しました");
    } finally {
      setLoading(null);
    }
  };

  const planColors: Record<string, string> = {
    basic: "#3a3a4a",
    pro: "#5e6ad2",
    enterprise: "#8b5cf6",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e2e2e5", margin: 0 }}>
          料金プラン
        </h1>
        <p style={{ fontSize: 14, color: "#7a7a8a", marginTop: 8 }}>
          ビジネスに最適なプランをお選びください
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {plans.map((plan) => {
          const isPro = plan.id === "pro";
          return (
            <div
              key={plan.id}
              style={{
                background: isPro ? "#13132a" : "#0f0f14",
                border: `1px solid ${isPro ? "#5e6ad2" : "#1e1e24"}`,
                borderRadius: 16,
                padding: 28,
                position: "relative",
                transition: "transform 0.2s",
              }}
            >
              {isPro && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#5e6ad2",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 12px",
                    borderRadius: 999,
                    letterSpacing: "0.05em",
                  }}
                >
                  人気No.1
                </div>
              )}

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: planColors[plan.id],
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {plan.id === "basic" ? "🌱" : plan.id === "pro" ? "⚡" : "🏢"}
              </div>

              <p style={{ fontSize: 16, fontWeight: 600, color: "#e2e2e5", margin: 0 }}>
                {plan.name}
              </p>

              <div style={{ margin: "16px 0" }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#e2e2e5" }}>
                  ¥{plan.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 13, color: "#7a7a8a" }}>/月</span>
              </div>

              <div style={{ marginBottom: 24 }}>
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "#5e6ad2", fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#c2c2cc" }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: isPro ? "#5e6ad2" : "#1e1e28",
                  border: `1px solid ${isPro ? "#5e6ad2" : "#2a2a35"}`,
                  borderRadius: 8,
                  color: isPro ? "white" : "#c2c2cc",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading === plan.id ? "not-allowed" : "pointer",
                  opacity: loading === plan.id ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {loading === plan.id ? "処理中..." : "このプランを選択"}
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#4a4a58", marginTop: 24 }}>
        ※ テストモードです。実際の請求は発生しません。
      </p>
    </div>
  );
}
