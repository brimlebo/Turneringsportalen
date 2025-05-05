import React from "react";
import TournamentView from "@/components/tournament/TournamentView";
import styles from "@/styles/page.module.css";

type Params = Promise<{ tournament_id: string }>;

export default async function TournamentPage(props: { params: Params }) {
  const param = await props.params;
  const tournament_key = parseInt(param.tournament_id, 10);

  return (
    <div
      style={{ backgroundColor: "var(--mainBg)" }}
      className={styles.container}
    >
      <TournamentView id={tournament_key} />
    </div>
  );
}
