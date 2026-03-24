"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface Document {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const API = "http://localhost:3001";

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setDocuments(data);
    } catch {
      toast.error("ファイル一覧の取得に失敗しました");
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/documents/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          fileSize: file.size,
          uploadedBy: "管理者",
        }),
      });
      const { uploadUrl } = await res.json();
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      toast.success(`${file.name} をアップロードしました`);
      fetchDocuments();
    } catch {
      toast.error("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => uploadFile(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024,
    onDropRejected: () => toast.error("ファイルサイズは50MB以下にしてください"),
  });

  const downloadFile = async (id: number, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/documents/${id}/download-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { downloadUrl } = await res.json();
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      a.click();
    } catch {
      toast.error("ダウンロードに失敗しました");
    }
  };

  const deleteFile = async (id: number, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${fileName} を削除しました`);
      fetchDocuments();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    return "📁";
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#e2e2e5", margin: 0 }}>
          資料管理
        </h1>
        <p style={{ fontSize: 13, color: "#7a7a8a", marginTop: 4 }}>
          ファイルのアップロード・ダウンロード・管理（最大50MB）
        </p>
      </div>

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "#5e6ad2" : "#2a2a35"}`,
          borderRadius: 12,
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragActive ? "#1a1a28" : "#0f0f14",
          marginBottom: 24,
          transition: "all 0.2s",
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 36, marginBottom: 12 }}>
          {uploading ? "⏳" : isDragActive ? "📂" : "📁"}
        </div>
        <p style={{ fontSize: 15, color: "#e2e2e5", margin: 0, fontWeight: 500 }}>
          {uploading
            ? "アップロード中..."
            : isDragActive
            ? "ここにドロップしてください"
            : "クリックまたはドラッグ&ドロップでアップロード"}
        </p>
        <p style={{ fontSize: 12, color: "#7a7a8a", marginTop: 6 }}>
          PDF / Excel / Word / 画像など（最大50MB）
        </p>
      </div>

      <div
        style={{
          background: "#0f0f14",
          border: "1px solid #1e1e24",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #1e1e24",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#e2e2e5" }}>
            ファイル一覧
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#7a7a8a",
              background: "#1e1e24",
              padding: "2px 10px",
              borderRadius: 20,
            }}
          >
            {documents.length}件
          </span>
        </div>

        {documents.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#4a4a58", fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            アップロードされたファイルはありません
          </div>
        ) : (
          documents.map((doc, index) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: index < documents.length - 1 ? "1px solid #1e1e24" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <span style={{ fontSize: 24 }}>{getFileIcon(doc.mimeType)}</span>
                <div>
                  <p style={{ fontSize: 14, color: "#e2e2e5", margin: 0, fontWeight: 500 }}>
                    {doc.fileName}
                  </p>
                  <p style={{ fontSize: 12, color: "#7a7a8a", margin: "2px 0 0" }}>
                    {formatSize(doc.fileSize)} · {doc.uploadedBy} ·{" "}
                    {new Date(doc.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => downloadFile(doc.id, doc.fileName)}
                  style={{
                    fontSize: 12,
                    color: "#5e6ad2",
                    background: "#1a1a28",
                    border: "1px solid #2a2a35",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  ↓ ダウンロード
                </button>
                <button
                  onClick={() => deleteFile(doc.id, doc.fileName)}
                  style={{
                    fontSize: 12,
                    color: "#e05c5c",
                    background: "#1a1a1e",
                    border: "1px solid #2a2a35",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  🗑 削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
