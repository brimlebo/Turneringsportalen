import { TabNav } from '@radix-ui/themes';

import { Theme } from "@radix-ui/themes";
import { createClient } from '@/utils/supabase/server';
import Nav from './nav';

export default async function NavigationMenu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return <Nav user={user} />
}