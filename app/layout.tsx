import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { inter, jetbrains, pixel } from "./fonts";

export const metadata: Metadata = {
  title: "Algo Clash — data structures & algorithms in C++",
  description: "A creature RPG where every battle is a real interview problem. Recognise the pattern, pick the data structure, write the C++.",
  appleWebApp: { capable: true, title: "Algo Clash", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#07050f",
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
