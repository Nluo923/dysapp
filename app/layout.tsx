/* eslint-disable @next/next/no-head-element */
"use client";

import "./globals.css";
import * as React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <head></head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Navbar className=""></Navbar>
                    <main className="px-6 py-2">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
