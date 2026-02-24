"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/database";
import AppShell from "@/components/AppShell";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("category")
      .order("name")
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  const handleUpdate = async (id: string, field: "stock" | "note", value: string | number) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <AppShell>
      <div style={{ padding: "20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#c9a96e" }}>
          商品管理
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#1a1814",
                border: "1px solid #2a2520",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d4" }}>{p.name}</span>
                {p.category && (
                  <span style={{ fontSize: 10, color: "#9a9088", background: "#2a2520", padding: "2px 8px", borderRadius: 4 }}>
                    {p.category}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ fontSize: 12, color: "#9a9088", flexShrink: 0 }}>在庫</label>
                <input
                  type="number"
                  defaultValue={p.stock}
                  onBlur={(e) => handleUpdate(p.id, "stock", parseInt(e.target.value) || 0)}
                  style={{
                    width: 60,
                    background: "#0e0c0a",
                    border: "1px solid #2a2520",
                    borderRadius: 6,
                    padding: "6px 8px",
                    color: p.stock <= 5 ? "#e87c6e" : "#e8e0d4",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                />
                <label style={{ fontSize: 12, color: "#9a9088", flexShrink: 0 }}>メモ</label>
                <input
                  type="text"
                  defaultValue={p.note}
                  onBlur={(e) => handleUpdate(p.id, "note", e.target.value)}
                  style={{
                    flex: 1,
                    background: "#0e0c0a",
                    border: "1px solid #2a2520",
                    borderRadius: 6,
                    padding: "6px 8px",
                    color: "#e8e0d4",
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p style={{ fontSize: 14, color: "#9a9088" }}>商品が登録されていません</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
