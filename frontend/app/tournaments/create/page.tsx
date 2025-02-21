import CreateTournamentView from "@/components/createTournament/CreateTournamentView";
import React from "react";

export default function TournamentCreatePage() {
  return (
    <React.Fragment>
      {/* Manually setting the background to the preferred dark background */}
      <div style={{ backgroundColor: "var(--background)" }}>
        <CreateTournamentView />
      </div>
    </React.Fragment>
  );
}
