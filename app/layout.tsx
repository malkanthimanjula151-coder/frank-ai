import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRANK CROFTON AI",
  description: "Your personal AI assistant",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
