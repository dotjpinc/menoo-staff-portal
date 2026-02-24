import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "menoo スタッフポータル",
  description: "飲食店スタッフ向けポータルアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ background: "#0e0c0a", color: "#e8e0d4", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
