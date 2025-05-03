"use client";

import { signOutAction } from "@/components/login/actions";
import {
  Box,
  TabNav,
  Flex,
  Card,
  Text,
  Avatar,
  Button,
} from "@radix-ui/themes";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav({ user }: { user: User | null }) {
  const pathname = usePathname();
  return (
    <React.Fragment>
      <Flex justify="between" style={{ backgroundColor: "var(--mainBg)" }}>
        <TabNav.Root color="tomato">
          <TabNav.Link
            active={pathname === "/"}
            href="/"
            style={{
              color:
                pathname === "/" ? "var(--highlighter2)" : "var(--text-color)",
            }}
          >
            Home
          </TabNav.Link>
          <TabNav.Link
            active={pathname.includes("/tournaments")}
            href="/tournaments"
            style={{
              color: pathname.includes("/tournaments")
                ? "var(--highlighter2)"
                : "var(--text-color)",
            }}
          >
            Tournaments
          </TabNav.Link>
        </TabNav.Root>
        {user ? (
          <Box m="3">
            <Flex direction="row" align="center" gap="5" justify="center">
              <Card asChild variant="ghost">
                <a href="/profile">
                  <Flex gap="3" align="center">
                    <Avatar
                      src={user?.user_metadata.avatar_url}
                      radius="full"
                      fallback={
                        user?.user_metadata.username?.[0]?.toUpperCase() ?? "?"
                      }
                    />
                    <Box>
                      <Text as="div" size="2">
                        {user?.email}
                      </Text>
                      <Text as="div" size="2">
                        {user?.user_metadata.userrole}
                      </Text>
                    </Box>
                  </Flex>
                </a>
              </Card>
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </Flex>
          </Box>
        ) : (
          <Box m="3">
            <Flex
              direction="row"
              align="center"
              gap="5"
              justify="center"
            ></Flex>
          </Box>
        )}
      </Flex>
    </React.Fragment>
  );
}
