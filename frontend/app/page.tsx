import React from "react";
import Image from "next/image";
import {
  Button,
  Box,
  Container,
  Flex,
  Grid,
  Section,
  Separator,
  Link,
} from "@radix-ui/themes";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import LoginDialog from "@/components/login/LogIn";
import { createClient } from "@/utils/supabase/server";
import SignUp from "@/components/signUp/SignUp";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Container
        size="4"
        style={{
          paddingRight: "calc(var(--scrollbar-width, 15px))",
          paddingTop: "8rem",
          paddingBottom: "2rem",
          paddingLeft: "2rem",
        }}
      >
        <Flex
          direction="column"
          style={{
            gap: "2rem",
          }}
        >
          {/* Hero Section */}
          <Flex
            align="center"
            justify="center"
            gap="9" // This will add space between the image and the content
          >
            {/* Image Box */}
            <Box>
              <Image
                src="/turneringsportalen_logo.png"
                alt="turneringsportalen logo"
                width={400}
                height={400}
                style={{ objectFit: "contain" }}
              />
            </Box>

            {/* Content Box */}
            <Flex direction="column" gap="4">
              <Box>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--highlighter2)",
                  }}
                >
                  Turneringsportalen
                </h1>
                <p style={{ color: "var(--highlighter1)" }}>
                  <em>from idea to fully fledged tournament in no time</em>
                </p>
              </Box>

              <Separator size="4" color="tomato" />
              {user ? (
                <Flex direction="column" gap="3">
                  <p style={{ color: "var(--highlighter1)" }}>
                    Welcome back, {user?.user_metadata.username}
                  </p>
                  <Link href="/tournaments/create">
                    <Button
                      size="3"
                      style={{
                        border: "1px solid var(--highlighter2)",
                        color: "var(--highlighter2)",
                        backgroundColor: "var(--secondaryBg)",
                        width: "100%"
                      }}
                    >
                      Create a tournament
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      size="3"
                      style={{
                        border: "1px solid var(--highlighter2)",
                        color: "var(--highlighter2)",
                        backgroundColor: "var(--secondaryBg)",
                        width: "100%"
                      }}
                    >
                      Checkout profile
                    </Button>
                  </Link>
                </Flex>
              ) : (
                <Flex direction="column" gap="3">
                  <p style={{ color: "var(--highlighter1)" }}>
                    Already a user?
                  </p>
                  <LoginDialog />
                  <p style={{ color: "var(--highlighter1)" }}>
                    Are you an event organizer or do you manage a team?
                  </p>
                  <SignUp />
                </Flex>
              )}
            </Flex>
          </Flex>
          <Box style={{ textAlign: "center" }}>
            <ArrowDownIcon
              style={{
                width: 60,
                height: 60,
                color: "var(--highlighter2)",
              }}
            />
          </Box>
          <Section style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ color: "var(--highlighter2)" }}>How it works</h2>
            <Grid columns="1fr 1fr 1fr" gap="4" style={{ marginTop: "2rem" }}>
              <Box>
                <h3 style={{ color: "var(--highlighter1)" }}>
                  1. Create a tournament
                </h3>
              </Box>
              <Box>
                <h3 style={{ color: "var(--highlighter1)" }}>
                  2. Invite participants
                </h3>
              </Box>
              <Box>
                <h3 style={{ color: "var(--highlighter1)" }}>
                  3. Start the tournament
                </h3>
              </Box>
            </Grid>
          </Section>
        </Flex>
      </Container>
    </>
  );
}
