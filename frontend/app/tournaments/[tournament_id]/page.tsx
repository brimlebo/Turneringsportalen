import React from "react";
import TournamentView from "@/components/tournament/TournamentView";

type Params = Promise<{ tournament_id: string }>;

export default async function TournamentPage(props: { params: Params }) {
  const param = await props.params;
  const tournament_key = parseInt(param.tournament_id, 10);

  console.log(tournament_key);
  return (
    <div>
      <TournamentView id={tournament_key} />
    </div>
  );
}
