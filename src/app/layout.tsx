import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});
const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-kr",
  weight: ["100", "200", "300", "400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Truezyme — Restore. The Skin Ecosystem.",
  description: "피부가 스스로 살아나는 방식, 트루자임. 제주 발효 코스메슈티컬.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoKr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
