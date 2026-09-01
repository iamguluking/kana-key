import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "かな Key｜美式 Mac 键盘かな输入练习",
  description: "使用美式 Mac 物理键盘练习日语かな输入，内置 1000 句带 ruby 注音的随机练习。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
