'use client'

import { signOutAction } from '@/app/login/actions';
import { Box, TabNav, Flex, Card, Text, Avatar, Button } from '@radix-ui/themes';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { Label } from 'radix-ui';
import React from 'react';
import LoginDialog from './login/LogIn';


export default function Nav({ user }: { user: User | null }) {
  const pathname = usePathname();
  console.log("Pathname: ", pathname);
  console.log("User: ", user);
  return (
    <React.Fragment>
      <Flex justify="between">

        <TabNav.Root >
          <TabNav.Link active={pathname === '/'} href="/">
            Home
          </TabNav.Link>
          <TabNav.Link active={pathname === '/tournaments/create'} href="/tournaments/create">
            Create Tournament
          </TabNav.Link>
          <TabNav.Link active={pathname === '/tournaments'} href="/tournaments">
            Tournaments
          </TabNav.Link>
          <TabNav.Link active={pathname === '/tournaments/1/registration'} href="/tournaments/1/registration">
            Register for tournament (temp)
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
                      fallback="A"
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
            <Flex direction="row" align="center" gap="5" justify="center">
{/*               <Button size="2" variant={"outline"}>
                <a href="/login">Log in</a>
              </Button> */}
              <LoginDialog />
              <Button size="2" variant={"classic"}>
                <a href="/">Sign up</a>
              </Button>
            </Flex>
          </Box>
        )}
      </Flex>
    </React.Fragment>
  );
}
