'use client'

import React from 'react';
import { Flex, Section, Separator } from '@radix-ui/themes';

export default function Footer() {
  return (
    <Section style={{
      textAlign: 'center',
      padding: '2rem',
      marginTop: 'auto',
      color: 'var(--gray-8)',
      fontSize: '0.8rem'
    }}>
      <Flex align="center" justify="center" gap="4">
        <p>About Us</p>
        <Separator size="4" orientation="vertical" style={{ backgroundColor: 'var(--gray-8)' }} />
        <p>Contact</p>
        <Separator size="4" orientation="vertical" style={{ backgroundColor: 'var(--gray-8)' }} />
        <p>Terms of Service</p>
        <Separator size="4" orientation="vertical" style={{ backgroundColor: 'var(--gray-8)' }} />
        <p>Privacy Policy</p>
        <Separator size="4" orientation="vertical" style={{ backgroundColor: 'var(--gray-8)' }} />
        <p>© 2024 Turneringsportalen</p>
      </Flex>
      <p style={{
          marginTop: '1rem',
          fontSize: '0.7rem'
      }}>
          Version: {process.env.NEXT_PUBLIC_GIT_SHA || 'development'}
      </p>
    </Section>
  );
}
