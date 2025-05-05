import TournamentsOverview from "@/components/tournament/TournamentsOverview";
import React from "react";
import styles from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

export default function TournamentsPage() {
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: "var(--mainBg)" }}
    >
      <h1 style={{ color: "var(--highlighter2)" }}>Upcoming tournaments</h1>

      <TournamentsOverview />
    </div>
  );
}
