import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "软件测试学习站",
  description: "个人软件测试学习、练习与面试训练系统",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 lg:p-10">{children}</main>
      </body>
    </html>
  );
}
