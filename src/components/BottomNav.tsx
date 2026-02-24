"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "ホーム", path: "/", icon: "🏠" },
  { label: "商品", path: "/products", icon: "📦" },
  { label: "マニュアル", path: "/manuals", icon: "📖" },
  { label: "シフト", path: "/shifts", icon: "📅" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#1a1814",
        borderTop: "1px solid #2a2520",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 64,
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              color: active ? "#c9a96e" : "#9a9088",
              fontSize: 10,
              padding: "8px 0",
              minWidth: 64,
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontWeight: active ? 700 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
