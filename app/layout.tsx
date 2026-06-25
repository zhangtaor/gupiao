import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Ideas Dashboard",
  description: "AI-powered stock ideas, scoring system, and market insights"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
