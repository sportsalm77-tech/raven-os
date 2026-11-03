import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "رافين | منظومة رافين التعليمية",
  description: "منظومة رافين التعليمية — مؤسسة رافيين للخدمات التعليمية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
