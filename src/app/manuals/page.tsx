"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Manual } from "@/types/database";
import AppShell from "@/components/AppShell";

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("manuals")
      .select("*")
      .order("sort_order")
      .order("title")
      .then(({ data }) => setManuals(data ?? []));
  }, []);

  const grouped = manuals.reduce<Record<string, Manual[]>>((acc, m) => {
    const key = m.category || "その他";
    (acc[key] ??= []).push(m);
    return acc;
  }, {});

  return (
    <AppShell>
      <div style={{ padding: "20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#c9a96e" }}>
          マニュアル
        </h1>

        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: "#9a9088", marginBottom: 8 }}>
              {category}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "#1a1814",
                    border: "1px solid #2a2520",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setOpenId(openId === m.id ? null : m.id)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "12px 14px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#e8e0d4" }}>
                      {m.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#9a9088", transition: "transform 0.2s", transform: openId === m.id ? "rotate(90deg)" : "none" }}>
                      ▶
                    </span>
                  </button>
                  {openId === m.id && (
                    <div style={{ padding: "0 14px 14px", borderTop: "1px solid #2a2520" }}>
                      <p style={{ fontSize: 13, color: "#e8e0d4", lineHeight: 1.7, whiteSpace: "pre-wrap", paddingTop: 12 }}>
                        {m.body}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        {manuals.length === 0 && (
          <p style={{ fontSize: 14, color: "#9a9088" }}>マニュアルが登録されていません</p>
        )}
      </div>
    </AppShell>
  );
}
