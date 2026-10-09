import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
export const metadata: Metadata = {
  title: "SubTracker demo",
  description: "A Next.js demo application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <Header />
        <main className="min-h-full flex flex-col">{children}</main>
      </body>
    </html>
  );
}
