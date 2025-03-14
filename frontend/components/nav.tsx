'use client'

import { TabNav } from '@radix-ui/themes';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Theme } from "@radix-ui/themes";


export default function Nav() {
  const pathname = usePathname();
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
