// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WriteSpace",
    template: "%s | WriteSpace",
  },
  description:
    "WriteSpace is a modern blogging platform for writers, students, and educators to publish and discover thoughtful articles.",
  openGraph: {
    title: "WriteSpace",
    description:
      "A modern blogging platform for writers, students, and educators.",
    type: "website",
    siteName: "WriteSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteSpace",
    description:
      "A modern blogging platform for writers, students, and educators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dark">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}