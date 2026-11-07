import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Forke Docs", template: "%s · Forke Docs" },
  description: "Documentation for Forke, the micro-task marketplace for developers.",
};
export const viewport: Viewport = { themeColor: "#FF7A00" };

// Apply the saved theme before first paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('forke-docs-theme')||'dark';document.documentElement.setAttribute('data-theme',t==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="bg-bg font-sans text-[15px] leading-[1.65] text-fg antialiased">{children}</body>
    </html>
  );
}
