import { redirect } from "next/navigation";
import styles from "@/styles/page.module.css";
import { createClient } from "@/utils/supabase/server";
import {
  Badge,
  Code,
  DataList,
  Flex,
  IconButton,
  Link,
} from "@radix-ui/themes";
import { CopyIcon } from "@radix-ui/react-icons";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }
  const user = data.user;

  return (
    <div
      style={{ backgroundColor: "var(--mainBg)" }}
      className={styles.container}
    >
      <p style={{ fontSize: "1.8rem", color: "var(--highlighter2)" }}>
        Hello, {user.user_metadata.username}
      </p>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label
            minWidth="88px"
            style={{ color: "var(--highlighter2)" }}
          >
            Name
          </DataList.Label>
          <DataList.Value style={{ color: "var(--highlighter1)" }}>
            {user.user_metadata.username}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label
            style={{ color: "var(--highlighter2)" }}
            minWidth="88px"
          >
            Email
          </DataList.Label>
          <DataList.Value>
            <Link
              style={{ color: "var(--highlighter1)" }}
              href={`mailto:${user.email}`}
            >
              {user.email}
            </Link>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label
            style={{ color: "var(--highlighter2)" }}
            minWidth="88px"
          >
            Role
          </DataList.Label>
          <DataList.Value style={{ color: "var(--highlighter1)" }}>
            {user.user_metadata.userrole}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label
            style={{ color: "var(--highlighter2)" }}
            minWidth="88px"
          >
            Created at
          </DataList.Label>
          <DataList.Value style={{ color: "var(--highlighter1)" }}>
            {new Date(user.created_at).toLocaleDateString()}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label
            style={{ color: "var(--highlighter2)" }}
            minWidth="88px"
          >
            ID
          </DataList.Label>
          <DataList.Value style={{ color: "var(--highlighter1)" }}>
            <Flex align="center" gap="2">
              <Code variant="ghost">{user.id}</Code>
              <IconButton
                size="1"
                aria-label="Copy value"
                color="gray"
                variant="ghost"
              >
                <CopyIcon />
              </IconButton>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label
            style={{ color: "var(--highlighter2)" }}
            minWidth="88px"
          >
            Status
          </DataList.Label>
          <DataList.Value>
            <Badge
              color={user.confirmed_at ? "jade" : "tomato"}
              variant="soft"
              radius="full"
            >
              {user.confirmed_at ? "Confirmed" : "Unconfirmed"}
            </Badge>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </div>
  );
}
