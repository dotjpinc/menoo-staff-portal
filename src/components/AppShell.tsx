"use client";

import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      {children}
      <BottomNav />
    </div>
  );
}
