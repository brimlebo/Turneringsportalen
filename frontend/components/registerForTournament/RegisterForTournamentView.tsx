import RegisterForTournamentForm from "./RegisterForTournamentForm";
import React from "react";
import styles from "@/styles/page.module.css";
import { Tournament } from "@/utils/types";

// Define props for the view component
interface RegisterForTournamentViewProps {
  tournament: Tournament; // Expect tournament data as a prop
}

/**
 * A component to create the view of the page where the user can register for a tournament
 * @param {RegisterForTournamentViewProps} props - Component props
 * @returns The view for tournament registration
 */
export default function RegisterForTournamentView({
  tournament,
}: RegisterForTournamentViewProps) {
  return (
    <div
      style={{
        padding: "16px",
        minHeight: "100vh",
        color: "var(--text-color)",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
      }}
    >
      <div className={styles.container}>
        {/* Use tournament name from props */}
        <h1>Register for {tournament.name}</h1>
        {/* Pass the tournament data down to the form */}
        <RegisterForTournamentForm tournament={tournament} />
      </div>
    </div>
  );
}
