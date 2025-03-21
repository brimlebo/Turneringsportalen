"use client";
import { signOutAction } from "@/app/login/actions";
import { Button, Flex, TabNav } from "@radix-ui/themes";
import { NavigationMenu } from "radix-ui";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@radix-ui/themes/components/context-menu";
import React, { useEffect, useRef, useState } from "react";

export default function AuthButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathRef = useRef<string>("/");
  
  //https://supabase.com/docs/reference/javascript/auth-onauthstatechange

  // Set current path using useRef on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      pathRef.current = window.location.pathname;
    }

    // Example: fetch user data from your supabase client
    (async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        //console.log(user);
        setUserEmail(user.email ?? null);
      }
    })();
  }, []);

  const pathname = pathRef.current;
  //console.log("Pathname: ", pathname);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tournaments/create", label: "Create Tournament" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/tournaments/1/registration", label: "Register for tournament (temp)" },
  ];

  return (
    <div>
      <Flex justify="between">
        {userEmail ? (
          <>
            <TabNav.Root>
              {navLinks.map((link) => (
                <TabNav.Link
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                >
                  {link.label}
                </TabNav.Link>
              ))}
            </TabNav.Root>
            <Label>Hey, {userEmail}!</Label>
            <form action={signOutAction}>
              <Button type="submit" variant={"outline"}>
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <Flex justify="between">
            <TabNav.Root>
              {navLinks.map((link) => (
                <TabNav.Link
                  key={link.href}
                  active={pathname === link.href}
                  href={link.href}
                >
                  {link.label}
                </TabNav.Link>
              ))}
            </TabNav.Root>
            <Button size="2" variant={"outline"}>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="2" variant={"classic"}>
              <Link href="/register">Sign up</Link>
            </Button>
          </Flex>
        )}
      </Flex>
    </div>
  );
}

