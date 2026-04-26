"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

type Message = {
  role: "user" | "ai";
  content: string;
  sources?: string[];
};

const SOURCE_LABEL: Record<string, string> = {
  announcement: "お知らせ",
  user: "社員情報",
  inquiry: "問い合わせ",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "こんにちは。社内 AI アシスタントです。お知らせ・社員情報・問い合わせ履歴をもとに回答します。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // バックエンドの RAG エンドポイントを呼び出す（API キーはサーバー側で管理）
      const { data } = await api.post<{ answer: string; sources: string[] }>(
        "/ai/chat",
        { message: userMessage }
      );
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.answer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-80px)]"
      style={{ background: "#0e0e10" }}
    >
      {/* ヘッダー */}
      <div
        style={{
          borderBottom: "1px solid #1e1e22",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#5e6ad2",
          }}
        />
        <span style={{ color: "#e2e2e5", fontSize: 13, fontWeight: 500 }}>
          AI Assistant
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#4a4a52",
            background: "#1a1a1e",
            padding: "2px 8px",
            borderRadius: 4,
            border: "1px solid #2a2a30",
          }}
        >
          RAG · Gemini 2.0 Flash
        </span>
      </div>

      {/* メッセージ一覧 */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
        className="space-y-4"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            {msg.role === "ai" && (
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#5e6ad2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "white",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                AI
              </div>
            )}

            <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius:
                    msg.role === "user"
                      ? "8px 8px 2px 8px"
                      : "8px 8px 8px 2px",
                  fontSize: 13,
                  lineHeight: 1.6,
                  background: msg.role === "user" ? "#5e6ad2" : "#1a1a1e",
                  color: msg.role === "user" ? "#ffffff" : "#c8c8d0",
                  border: msg.role === "user" ? "none" : "1px solid #2a2a30",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>

              {/* 参照ソースバッジ */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {msg.sources.map((src) => (
                    <span
                      key={src}
                      style={{
                        fontSize: 10,
                        color: "#7878a0",
                        background: "#1a1a24",
                        border: "1px solid #2a2a38",
                        borderRadius: 3,
                        padding: "1px 6px",
                      }}
                    >
                      {SOURCE_LABEL[src] ?? src}を参照
                    </span>
                  ))}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#2a2a35",
                  border: "1px solid #3a3a42",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#8888a0",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                N
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#5e6ad2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "white",
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div
              style={{
                padding: "8px 14px",
                borderRadius: "8px 8px 8px 2px",
                background: "#1a1a1e",
                border: "1px solid #2a2a30",
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#5e6ad2",
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div
        style={{
          borderTop: "1px solid #1e1e22",
          padding: "12px 20px",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="社内情報について質問してください..."
            style={{
              width: "100%",
              background: "#1a1a1e",
              border: "1px solid #2a2a30",
              borderRadius: 8,
              padding: "9px 14px",
              fontSize: 13,
              color: "#e2e2e5",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() && !loading ? "#5e6ad2" : "#2a2a35",
            color: input.trim() && !loading ? "white" : "#4a4a58",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 13,
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            transition: "all 0.15s",
            fontWeight: 500,
          }}
        >
          送信
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        input::placeholder { color: #4a4a58; }
      `}</style>
    </div>
  );
}
