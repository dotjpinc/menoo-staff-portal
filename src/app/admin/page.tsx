"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Notice, Product, Manual } from "@/types/database";

type Tab = "notices" | "products" | "manuals";

const PASSWORD = "menoo2026";

// ── Style constants ──
const colors = {
  bg: "#0e0c0a",
  card: "#1a1814",
  border: "#2a2520",
  accent: "#c9a96e",
  text: "#e8e0d4",
  muted: "#9a9088",
  danger: "#e87c6e",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  color: colors.text,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 20px",
  background: colors.accent,
  color: "#0e0c0a",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  padding: "6px 14px",
  background: "transparent",
  border: `1px solid ${colors.danger}`,
  borderRadius: 6,
  color: colors.danger,
  fontSize: 12,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 20px",
  background: colors.border,
  color: colors.text,
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
};

// ── Main Component ──
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<Tab>("notices");

  // Data
  const [notices, setNotices] = useState<Notice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [manuals, setManuals] = useState<Manual[]>([]);

  // Forms
  const [noticeForm, setNoticeForm] = useState({ title: "", body: "", tag: "" });
  const [productForm, setProductForm] = useState({ name: "", category: "", stock: 0, note: "" });
  const [manualForm, setManualForm] = useState({ title: "", category: "", body: "", sort_order: 0 });

  // Edit modal
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingManual, setEditingManual] = useState<Manual | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("menoo_admin") === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetchAll();
    }
  }, [authed]);

  function fetchAll() {
    supabase.from("notices").select("*").order("created_at", { ascending: false }).then(({ data }) => setNotices(data ?? []));
    supabase.from("products").select("*").order("name").then(({ data }) => setProducts(data ?? []));
    supabase.from("manuals").select("*").order("sort_order").then(({ data }) => setManuals(data ?? []));
  }

  function handleLogin() {
    if (pw === PASSWORD) {
      sessionStorage.setItem("menoo_admin", "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  // ── CRUD: Notices ──
  async function addNotice() {
    if (!noticeForm.title.trim()) return;
    await supabase.from("notices").insert([noticeForm]);
    setNoticeForm({ title: "", body: "", tag: "" });
    fetchAll();
  }

  async function updateNotice() {
    if (!editingNotice) return;
    const { id, created_at, ...rest } = editingNotice;
    await supabase.from("notices").update(rest).eq("id", id);
    setEditingNotice(null);
    fetchAll();
  }

  async function deleteNotice(id: string) {
    if (!confirm("このお知らせを削除しますか？")) return;
    await supabase.from("notices").delete().eq("id", id);
    fetchAll();
  }

  // ── CRUD: Products ──
  async function addProduct() {
    if (!productForm.name.trim()) return;
    await supabase.from("products").insert([productForm]);
    setProductForm({ name: "", category: "", stock: 0, note: "" });
    fetchAll();
  }

  async function updateProduct() {
    if (!editingProduct) return;
    const { id, created_at, ...rest } = editingProduct;
    await supabase.from("products").update(rest).eq("id", id);
    setEditingProduct(null);
    fetchAll();
  }

  async function deleteProduct(id: string) {
    if (!confirm("この商品を削除しますか？")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchAll();
  }

  // ── CRUD: Manuals ──
  async function addManual() {
    if (!manualForm.title.trim()) return;
    await supabase.from("manuals").insert([manualForm]);
    setManualForm({ title: "", category: "", body: "", sort_order: 0 });
    fetchAll();
  }

  async function updateManual() {
    if (!editingManual) return;
    const { id, created_at, ...rest } = editingManual;
    await supabase.from("manuals").update(rest).eq("id", id);
    setEditingManual(null);
    fetchAll();
  }

  async function deleteManual(id: string) {
    if (!confirm("このマニュアルを削除しますか？")) return;
    await supabase.from("manuals").delete().eq("id", id);
    fetchAll();
  }

  // ── Wrapper ──
  const shell: React.CSSProperties = {
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    background: colors.bg,
  };

  // ── Password Screen ──
  if (!authed) {
    return (
      <div style={shell}>
        <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.accent }}>管理者ログイン</h1>
          <input
            type="password"
            placeholder="パスワード"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, maxWidth: 280, textAlign: "center" }}
          />
          {pwError && <p style={{ color: colors.danger, fontSize: 13 }}>パスワードが正しくありません</p>}
          <button onClick={handleLogin} style={btnPrimary}>ログイン</button>
        </div>
      </div>
    );
  }

  // ── Tabs ──
  const tabs: { key: Tab; label: string }[] = [
    { key: "notices", label: "お知らせ" },
    { key: "products", label: "商品" },
    { key: "manuals", label: "マニュアル" },
  ];

  // ── Modal overlay ──
  function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
      <div
        onClick={onClose}
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
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 20,
            maxWidth: 400,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      {/* Header */}
      <div style={{ padding: "20px 16px 0" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.accent, marginBottom: 16 }}>管理者画面</h1>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${colors.border}` }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "transparent",
                border: "none",
                borderBottom: tab === t.key ? `2px solid ${colors.accent}` : "2px solid transparent",
                color: tab === t.key ? colors.accent : colors.muted,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* ── お知らせ Tab ── */}
        {tab === "notices" && (
          <>
            {/* Add form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.muted }}>新規追加</h3>
              <input style={inputStyle} placeholder="タイトル" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} />
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="本文" value={noticeForm.body} onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })} />
              <input style={inputStyle} placeholder="タグ（例: 重要）" value={noticeForm.tag} onChange={(e) => setNoticeForm({ ...noticeForm, tag: e.target.value })} />
              <button onClick={addNotice} style={btnPrimary}>追加</button>
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notices.map((n) => (
                <div key={n.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{n.title}</span>
                    {n.tag && (
                      <span style={{ fontSize: 10, background: colors.border, color: colors.accent, padding: "2px 8px", borderRadius: 4 }}>{n.tag}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>{new Date(n.created_at).toLocaleDateString("ja-JP")}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingNotice({ ...n })} style={{ ...btnSecondary, padding: "6px 14px", fontSize: 12 }}>編集</button>
                    <button onClick={() => deleteNotice(n.id)} style={btnDanger}>削除</button>
                  </div>
                </div>
              ))}
              {notices.length === 0 && <p style={{ fontSize: 14, color: colors.muted }}>データなし</p>}
            </div>

            {/* Edit modal */}
            {editingNotice && (
              <Modal onClose={() => setEditingNotice(null)}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>お知らせ編集</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input style={inputStyle} value={editingNotice.title} onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })} />
                  <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={editingNotice.body} onChange={(e) => setEditingNotice({ ...editingNotice, body: e.target.value })} />
                  <input style={inputStyle} value={editingNotice.tag} onChange={(e) => setEditingNotice({ ...editingNotice, tag: e.target.value })} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={updateNotice} style={{ ...btnPrimary, flex: 1 }}>保存</button>
                    <button onClick={() => setEditingNotice(null)} style={{ ...btnSecondary, flex: 1 }}>キャンセル</button>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}

        {/* ── 商品 Tab ── */}
        {tab === "products" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.muted }}>新規追加</h3>
              <input style={inputStyle} placeholder="商品名" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              <input style={inputStyle} placeholder="カテゴリ" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
              <input style={inputStyle} type="number" placeholder="在庫数" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
              <input style={inputStyle} placeholder="備考" value={productForm.note} onChange={(e) => setProductForm({ ...productForm, note: e.target.value })} />
              <button onClick={addProduct} style={btnPrimary}>追加</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {products.map((p) => (
                <div key={p.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: colors.muted }}>{p.category}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: p.stock <= 5 ? colors.danger : colors.muted }}>在庫: {p.stock}</span>
                    {p.note && <span style={{ fontSize: 12, color: colors.muted }}>{p.note}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingProduct({ ...p })} style={{ ...btnSecondary, padding: "6px 14px", fontSize: 12 }}>編集</button>
                    <button onClick={() => deleteProduct(p.id)} style={btnDanger}>削除</button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p style={{ fontSize: 14, color: colors.muted }}>データなし</p>}
            </div>

            {editingProduct && (
              <Modal onClose={() => setEditingProduct(null)}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>商品編集</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input style={inputStyle} value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                  <input style={inputStyle} value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                  <input style={inputStyle} type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                  <input style={inputStyle} value={editingProduct.note} onChange={(e) => setEditingProduct({ ...editingProduct, note: e.target.value })} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={updateProduct} style={{ ...btnPrimary, flex: 1 }}>保存</button>
                    <button onClick={() => setEditingProduct(null)} style={{ ...btnSecondary, flex: 1 }}>キャンセル</button>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}

        {/* ── マニュアル Tab ── */}
        {tab === "manuals" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.muted }}>新規追加</h3>
              <input style={inputStyle} placeholder="タイトル" value={manualForm.title} onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })} />
              <input style={inputStyle} placeholder="カテゴリ" value={manualForm.category} onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })} />
              <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="本文" value={manualForm.body} onChange={(e) => setManualForm({ ...manualForm, body: e.target.value })} />
              <input style={inputStyle} type="number" placeholder="表示順" value={manualForm.sort_order} onChange={(e) => setManualForm({ ...manualForm, sort_order: Number(e.target.value) })} />
              <button onClick={addManual} style={btnPrimary}>追加</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {manuals.map((m) => (
                <div key={m.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{m.title}</span>
                    <span style={{ fontSize: 12, color: colors.muted }}>{m.category}</span>
                  </div>
                  <p style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>表示順: {m.sort_order}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingManual({ ...m })} style={{ ...btnSecondary, padding: "6px 14px", fontSize: 12 }}>編集</button>
                    <button onClick={() => deleteManual(m.id)} style={btnDanger}>削除</button>
                  </div>
                </div>
              ))}
              {manuals.length === 0 && <p style={{ fontSize: 14, color: colors.muted }}>データなし</p>}
            </div>

            {editingManual && (
              <Modal onClose={() => setEditingManual(null)}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>マニュアル編集</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input style={inputStyle} value={editingManual.title} onChange={(e) => setEditingManual({ ...editingManual, title: e.target.value })} />
                  <input style={inputStyle} value={editingManual.category} onChange={(e) => setEditingManual({ ...editingManual, category: e.target.value })} />
                  <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={editingManual.body} onChange={(e) => setEditingManual({ ...editingManual, body: e.target.value })} />
                  <input style={inputStyle} type="number" value={editingManual.sort_order} onChange={(e) => setEditingManual({ ...editingManual, sort_order: Number(e.target.value) })} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={updateManual} style={{ ...btnPrimary, flex: 1 }}>保存</button>
                    <button onClick={() => setEditingManual(null)} style={{ ...btnSecondary, flex: 1 }}>キャンセル</button>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </div>
    </div>
  );
}
