"use client"; // This component will render on the client side, required when using React hooks

import React from "react";
import { Button, Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tournament } from "@/utils/types"; // Import the Tournament type

/**
 * A component which contains the form to register for a tournament
 * @returns The form to register for a tournament
 */
export default function RegisterForTournamentForm() {
    // Get the tournament_id from the URL
    const params = useParams();
    const tournamentId = params.tournament_id;

    // State to store the tournament details (to display in the form)
    const [tournamentDetails, setTournamentDetails] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    // State to store the input fields as a single object to limit the amount of state variables
    const [inputFields, setInputFields] = useState({
        team_name: "",
        captain_name: "",
        email: "",
        phone: "",
        number_of_players: 1,
        additional_notes: "",
    });

    // Function to fetch tournament details
    useEffect(() => {
        const fetchTournamentDetails = async () => {
            try {
                // TODO: Replace this with actual API call
                // Use frontend/utils/API.ts

                // Mocking the tournament data for now
                const mockData: Tournament = {
                    tournament_id: Number(tournamentId),
                    name: "ABC-turnering",
                    start_date: new Date("2025-03-01"),
                    location: "Brann stadion",
                    fields: [],
                    match_interval: 30
                };

                setTournamentDetails(mockData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tournament details:", error);
                setLoading(false);
            }
        };

        if (tournamentId) {
            fetchTournamentDetails();
        }
    }, [tournamentId]);

    // Function to update the state when the input fields change
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    }

    // Function to handle the form submission
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the default form submission, which would cause a page reload

        // Create the registration data object
        const registrationData = {
            tournament_id: tournamentId,
            ...inputFields
        };

        console.log("Registration data:", registrationData);

        // TODO: Make an API call to register the team
        // Use frontend/utils/API.ts
    }

    // Common styles for the labels
    const labelStyle = {
        fontWeight: "500",
        color: "var(--text-color)",
    };

    // Common styles for the input fields
    const inputStyle = {
        color: "var(--text-color)",
        padding: "14px",
        borderRadius: "8px",
        backgroundColor: "var(--input-color)",
        border: "1px solid var(--border-color)",
    };

    if (loading) {
        return <div>Loading tournament details...</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: "100%",
                maxWidth: "400px",
                padding: "24px",
                border: "1px solid var(--border-color)",
                borderRadius: "28px",
                backgroundColor: "var(--form-background)",
                color: "var(--text-color)",
            }}
        >
            {tournamentDetails && (
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ marginBottom: "8px" }}>{tournamentDetails.name}</h2>
                    <p style={{ marginBottom: "4px" }}>Date: {tournamentDetails.start_date.toISOString().split('T')[0]}</p>
                    <p>Location: {tournamentDetails.location}</p>
                </div>
            )}

            <Flex direction="column" gap="4">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="team_name">
                            Team Name
                        </label>
                        <input
                            id="team_name"
                            name="team_name"
                            value={inputFields.team_name}
                            onChange={handleChange}
                            placeholder="Enter your team name"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="captain_name">
                            Captain Name
                        </label>
                        <input
                            id="captain_name"
                            name="captain_name"
                            value={inputFields.captain_name}
                            onChange={handleChange}
                            placeholder="Enter team captain's name"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="email">
                            Contact Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={inputFields.email}
                            onChange={handleChange}
                            placeholder="Enter contact email"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="phone">
                            Contact Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            value={inputFields.phone}
                            onChange={handleChange}
                            placeholder="Enter contact phone number"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="number_of_players">
                            Number of Players
                        </label>
                        <input
                            id="number_of_players"
                            name="number_of_players"
                            type="number"
                            min="1"
                            value={inputFields.number_of_players}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={labelStyle} htmlFor="additional_notes">
                            Additional Notes
                        </label>
                        <textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={inputFields.additional_notes}
                            onChange={handleChange}
                            placeholder="Any additional information you'd like to share"
                            style={{
                                ...inputStyle,
                                minHeight: "100px",
                                resize: "vertical"
                            }}
                        />
                    </div>
                </div>

                <Button
                    style={{
                        width: "fit-content",
                        backgroundColor: "var(--submit-button-color)",
                        color: "var(--text-color)",
                        border: "1px solid var(--border-color)",
                        padding: "16px",
                        borderRadius: "16px",
                        fontSize: "16px",
                    }}
                    type="submit"
                >
                    Register for Tournament
                </Button>
            </Flex>
        </form>
    );
}
