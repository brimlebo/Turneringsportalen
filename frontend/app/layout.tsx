import type { Metadata } from "next";
import "../styles/globals.css";
import { Theme, Flex, Box } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
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
      <head />
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
            <Flex direction="column" style={{ minHeight: "100vh" }}>
              <NavigationMenu />
              {/* Wrap children in a Box that can grow */}
              <Box style={{ flexGrow: 1, backgroundColor: "var(--mainBg)" }}>
                {children}
              </Box>
              <Footer />
            </Flex>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
