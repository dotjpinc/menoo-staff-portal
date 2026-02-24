"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Shift } from "@/types/database";
import AppShell from "@/components/AppShell";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [date, setDate] = useState("");
  const [staffName, setStaffName] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from("shifts")
      .select("*")
      .order("date")
      .order("time_range")
      .then(({ data }) => setShifts(data ?? []));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!date || !staffName || !timeRange) return;
    setSaving(true);
    await supabase.from("shifts").insert({ date, staff_name: staffName, time_range: timeRange });
    setDate("");
    setStaffName("");
    setTimeRange("");
    setSaving(false);
    load();
  };

  const grouped = shifts.reduce<Record<string, Shift[]>>((acc, s) => {
    (acc[s.date] ??= []).push(s);
    return acc;
  }, {});

  const inputStyle: React.CSSProperties = {
    background: "#0e0c0a",
    border: "1px solid #2a2520",
    borderRadius: 6,
    padding: "8px 10px",
    color: "#e8e0d4",
    fontSize: 14,
    width: "100%",
  };

  return (
    <AppShell>
      <div style={{ padding: "20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#c9a96e" }}>
          シフト管理
        </h1>

        {/* 追加フォーム */}
        <section
          style={{
            background: "#1a1814",
            border: "1px solid #2a2520",
            borderRadius: 8,
            padding: 14,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "#9a9088", marginBottom: 10 }}>
            シフト追加
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            <input placeholder="スタッフ名" value={staffName} onChange={(e) => setStaffName(e.target.value)} style={inputStyle} />
            <input placeholder="時間帯（例: 10:00-15:00）" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={inputStyle} />
            <button
              onClick={handleAdd}
              disabled={saving || !date || !staffName || !timeRange}
              style={{
                background: "#c9a96e",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                color: "#0e0c0a",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                opacity: saving || !date || !staffName || !timeRange ? 0.5 : 1,
              }}
            >
              {saving ? "保存中..." : "追加"}
            </button>
          </div>
        </section>

        {/* シフト一覧 */}
        {Object.entries(grouped).map(([d, items]) => (
          <section key={d} style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: "#9a9088", marginBottom: 8 }}>
              {new Date(d + "T00:00:00").toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: "#1a1814",
                    border: "1px solid #2a2520",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#e8e0d4" }}>{s.staff_name}</span>
                  <span style={{ fontSize: 13, color: "#c9a96e" }}>{s.time_range}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
        {shifts.length === 0 && (
          <p style={{ fontSize: 14, color: "#9a9088" }}>シフトが登録されていません</p>
        )}
      </div>
    </AppShell>
  );
}
