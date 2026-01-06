import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cổng Bầu Cử Cổ Đông",
  description: "Hệ thống biểu quyết online an toàn và minh bạch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="antialiased">
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
