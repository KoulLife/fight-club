import type { Metadata } from "next";
import { Chakra_Petch, Teko } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const teko = Teko({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-teko",
});

export const metadata: Metadata = {
  title: "FIGHTWEEK | UFC Productivity Hub",
  description: "목표는 시합이고, 일상은 캠프다. UFC 테마 생산성 & 파이트 캠프 플래너",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${chakraPetch.variable} ${teko.variable} dark h-full`}>
      <body className="h-full bg-[#07090c] text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
