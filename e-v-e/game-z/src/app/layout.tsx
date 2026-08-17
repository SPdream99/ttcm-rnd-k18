import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuizQuest - Game Trắc Nghiệm Tính Điểm & Tri Thức Học Tập",
  description: "Trải nghiệm game trắc nghiệm học tập tương tác bằng Next.js với 3 chế độ chơi, tính điểm combo streak, quyền trợ giúp và lời giải thích chi tiết.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

