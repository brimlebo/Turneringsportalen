"use client";

import React from "react";
import { Flex, Section, Separator } from "@radix-ui/themes";

export default function Footer() {
  return (
    <Section
      style={{
        textAlign: "center",
        padding: "2rem",
        marginTop: "auto",
        color: "var(--gray-8)",
        fontSize: "0.8rem",
        backgroundColor: "var(--mainBg)",
      }}
    >
      <Flex align="center" justify="center" gap="4">
        <p style={{ color: "var(--tertiaryColor)" }}>About Us</p>
        <Separator
          size="4"
          orientation="vertical"
          style={{ backgroundColor: "var(--gray-8)" }}
        />
        <p style={{ color: "var(--tertiaryColor)" }}>Contact</p>
        <Separator
          size="4"
          orientation="vertical"
          style={{ backgroundColor: "var(--gray-8)" }}
        />
        <p style={{ color: "var(--tertiaryColor)" }}>Terms of Service</p>
        <Separator
          size="4"
          orientation="vertical"
          style={{ backgroundColor: "var(--gray-8)" }}
        />
        <p style={{ color: "var(--tertiaryColor)" }}>Privacy Policy</p>
        <Separator
          size="4"
          orientation="vertical"
          style={{ backgroundColor: "var(--gray-8)" }}
        />
        <p style={{ color: "var(--tertiaryColor)" }}>
          © 2025 Turneringsportalen
        </p>
      </Flex>
      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.7rem",
          color: "var(--tertiaryColor)",
        }}
      >
        Version: {process.env.NEXT_PUBLIC_GIT_SHA || "development"}
      </p>
    </Section>
  );
}
