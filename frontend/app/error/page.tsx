"use client";
import styles from "@/styles/page.module.css";
import { LinkBreak2Icon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <Flex direction="column" align="center" justify="center" gap="24px">
        <h1>Oops! Something went wrong.</h1>
        <Flex direction="column" align="center" justify="center" gap="8px">
          <p>We couldn't process your request. Please try again later.</p>
          <p>If the problem persists, contact our support team.</p>
        </Flex>
        <LinkBreak2Icon width={75} height={75} />
      </Flex>
    </div>
  );
}
