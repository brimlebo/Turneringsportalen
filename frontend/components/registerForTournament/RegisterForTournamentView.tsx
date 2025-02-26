import RegisterForTournamentForm from "./RegisterForTournamentForm";
import React from "react";

/**
 * A component to create the view of the page where the user can create a tournament
 * @returns The view of the page where the user can create a tournament
 */
export default function RegisterForTournamentView() {
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
            <h1>Register for a Tournament</h1>
            <p>Register for ABC-turnering here</p>
            <RegisterForTournamentForm />
        </div>
    );
}
