import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LYO-AI — Your AI Career Companion",
  description: "AI-powered career companion helping South African youth move from unemployment to employment.",
  keywords: "jobs, learnerships, bursaries, South Africa, youth employment, AI career",
  authors: [{ name: "LYO-AI" }],
  openGraph: {
    title: "LYO-AI — Your AI Career Companion",
    description: "From unemployment to employment — powered by AI.",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0f1e" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className="bg-[#0a0f1e] text-white antialiased min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}