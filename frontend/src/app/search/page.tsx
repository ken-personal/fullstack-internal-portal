"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SearchResults {
  users: Array<{ id: number; name: string; email: string; role: string; createdAt: string }>;
  announcements: Array<{ id: number; title: string; content: string; createdAt: string }>;
  inquiries: Array<{ id: number; title: string; message: string; createdAt: string }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const API = "http://localhost:3001";

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResults(data);
    } catch {
      toast.error("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    const timer = setTimeout(() => search(q), 300);
    return () => clearTimeout(timer);
  };

  const totalResults = results
    ? results.users.length + results.announcements.length + results.inquiries.length
    : 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#e2e2e5", margin: 0 }}>
          全文検索
        </h1>
        <p style={{ fontSize: 13, color: "#7a7a8a", marginTop: 4 }}>
          社員・お知らせ・お問い合わせを横断検索
        </p>
      </div>

      {/* 検索バー */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 16,
            color: "#4a4a58",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="キーワードを入力（2文字以上）..."
          style={{
            width: "100%",
            padding: "14px 14px 14px 42px",
            background: "#0f0f14",
            border: "1px solid #2a2a35",
            borderRadius: 10,
            color: "#e2e2e5",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
          }}
          autoFocus
        />
        {loading && (
          <span
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: "#7a7a8a",
            }}
          >
            検索中...
          </span>
        )}
      </div>

      {/* 検索結果 */}
      {results && (
        <div>
          <p style={{ fontSize: 13, color: "#7a7a8a", marginBottom: 16 }}>
            {totalResults > 0 ? `${totalResults}件の結果` : "結果が見つかりませんでした"}
          </p>

          {/* 社員 */}
          {results.users.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#5e6ad2", fontWeight: 600, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                社員
              </p>
              {results.users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    background: "#0f0f14",
                    border: "1px solid #1e1e24",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 14, color: "#e2e2e5", margin: 0, fontWeight: 500 }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#7a7a8a", margin: "4px 0 0" }}>
                    {user.email} · {user.role}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* お知らせ */}
          {results.announcements.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#5e6ad2", fontWeight: 600, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                お知らせ
              </p>
              {results.announcements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: "#0f0f14",
                    border: "1px solid #1e1e24",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 14, color: "#e2e2e5", margin: 0, fontWeight: 500 }}>
                    {a.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#7a7a8a", margin: "4px 0 0" }}>
                    {a.content.slice(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* お問い合わせ */}
          {results.inquiries.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#5e6ad2", fontWeight: 600, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                お問い合わせ
              </p>
              {results.inquiries.map((i) => (
                <div
                  key={i.id}
                  style={{
                    background: "#0f0f14",
                    border: "1px solid #1e1e24",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 14, color: "#e2e2e5", margin: 0, fontWeight: 500 }}>
                    {i.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#7a7a8a", margin: "4px 0 0" }}>
                    {i.message.slice(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 初期状態 */}
      {!results && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#4a4a58", fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          キーワードを入力して検索してください
        </div>
      )}
    </div>
  );
}
