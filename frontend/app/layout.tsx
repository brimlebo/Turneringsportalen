import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider}  from "next-themes";
import React from "react";
import Footer from "@/components/footer";
import NavigationMenu from "@/components/navigation-menu";

export const metadata: Metadata = {
  title: "Turneringsportalen",
  description: "A platform for creating and managing tournaments",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme
            accentColor="sky"
            grayColor="gray"
            panelBackground="solid"
            scaling="100%"
            radius="full"
          >
            <NavigationMenu/>
            {children}
            <Footer/>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
