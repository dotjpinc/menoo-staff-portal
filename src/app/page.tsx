"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Notice, Product } from "@/types/database";
import AppShell from "@/components/AppShell";

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [alerts, setAlerts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => {
    supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setNotices(data ?? []));

    supabase
      .from("products")
      .select("*")
      .lte("stock", 5)
      .order("stock", { ascending: true })
      .then(({ data }) => setAlerts(data ?? []));
  }, []);

  return (
    <AppShell>
      <div style={{ padding: "20px 16px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#c9a96e" }}>
          menoo スタッフポータル
        </h1>

        {/* 在庫アラート */}
        {alerts.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#e87c6e", marginBottom: 10 }}>
              在庫アラート
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#1a1814",
                    border: "1px solid #3a2020",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#e8e0d4" }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: "#e87c6e", fontWeight: 600 }}>
                    残 {p.stock}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* お知らせ */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#9a9088", marginBottom: 10 }}>
            お知らせ
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notices.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelected(n)}
                style={{
                  background: "#1a1814",
                  border: "1px solid #2a2520",
                  borderRadius: 8,
                  padding: "12px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d4" }}>
                    {n.title}
                  </span>
                  {n.tag && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "#2a2520",
                        color: "#c9a96e",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {n.tag}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#9a9088" }}>
                  {new Date(n.created_at).toLocaleDateString("ja-JP")}
                </span>
              </button>
            ))}
            {notices.length === 0 && (
              <p style={{ fontSize: 14, color: "#9a9088" }}>お知らせはありません</p>
            )}
          </div>
        </section>
      </div>

      {/* モーダル */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1814",
              border: "1px solid #2a2520",
              borderRadius: 12,
              padding: 20,
              maxWidth: 400,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8e0d4" }}>{selected.title}</h3>
              {selected.tag && (
                <span
                  style={{
                    fontSize: 10,
                    background: "#2a2520",
                    color: "#c9a96e",
                    padding: "2px 8px",
                    borderRadius: 4,
                    flexShrink: 0,
                    marginLeft: 8,
                  }}
                >
                  {selected.tag}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#9a9088", marginBottom: 12 }}>
              {new Date(selected.created_at).toLocaleDateString("ja-JP")}
            </p>
            <p style={{ fontSize: 14, color: "#e8e0d4", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {selected.body}
            </p>
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "10px 0",
                background: "#2a2520",
                border: "none",
                borderRadius: 8,
                color: "#e8e0d4",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
