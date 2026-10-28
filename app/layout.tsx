import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { inter, jetbrains, pixel } from "./fonts";

export const metadata: Metadata = {
  title: "Algo Clash: C++ interview creature RPG",
  description: "A handheld-style creature RPG where every battle is a real interview problem. Recognise the pattern, pick the data structure, write the C++ by hand.",
  // iPhone "Add to Home Screen": open full-screen like an app
  appleWebApp: { capable: true, title: "Algo Clash", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0d1c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${pixel.variable} h-full`}>
      <body className="min-h-full">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
