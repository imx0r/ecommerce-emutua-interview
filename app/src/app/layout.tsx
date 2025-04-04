import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const fontInter = Inter({
    subsets: ["latin"]
});
export const metadata: Metadata = {
  title: "eMutua Digital e-commerce"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${fontInter.className} antialiased`}
      >
      {children}
      </body>
    </html>
  );
}
