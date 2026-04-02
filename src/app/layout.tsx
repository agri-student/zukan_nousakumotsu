import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Digital Agri-Pedia | 農作物デジタル図鑑",
    template: "%s | Digital Agri-Pedia",
  },
  description:
    "農作物の育て方・旬の時期・栽培カレンダーを網羅したデジタル図鑑。家庭菜園から本格農業まで、植物を育てる喜びをすべての人へ。",
  keywords: ["農作物", "図鑑", "家庭菜園", "育て方", "栽培カレンダー", "野菜"],
  openGraph: {
    title: "Digital Agri-Pedia | 農作物デジタル図鑑",
    description:
      "農作物の育て方・旬の時期・栽培カレンダーを網羅したデジタル図鑑",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
