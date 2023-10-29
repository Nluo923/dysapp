/* eslint-disable @next/next/no-head-element */
"use client";

import "./globals.css";
import * as React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded-full dark">
      <head></head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar className=""></Navbar>
          <main className="px-6 py-2">{children}</main>
          <Toaster></Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
