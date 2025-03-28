"use client"; // This component will render on the client side, required when using React hooks

import React, {useState, useEffect} from "react";
import {Button, Flex} from "@radix-ui/themes";
import {useParams} from "next/navigation";
import {Tournament, CreateParticipantDTO} from "@/utils/types";
import {fetchTournamentById, registerParticipant} from "@/utils/API";

/**
 * A component which contains the form to register for a tournament
 * @returns The form to register for a tournament
 */
export default function RegisterForTournamentForm() {
  // Get the tournament_id from the URL
  const params = useParams();
  // Ensure tournamentId is treated as a number
  const tournamentIdParam = params.tournament_id;
  const tournamentId = typeof tournamentIdParam === 'string' ? parseInt(tournamentIdParam, 10) : undefined;

  // State to store the tournament details (to display in the form)
  const [tournamentDetails, setTournamentDetails] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for fetch/submit errors
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  // State to store the input fields as a single object to limit the amount of state variables
  const [inputFields, setInputFields] = useState({
    team_name: "",
  });

  // Function to fetch tournament details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!tournamentId || isNaN(tournamentId)) {
        setError("Invalid Tournament ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const wholeTournamentData = await fetchTournamentById(tournamentId);
        // Extract the tournament details and ensure start_date is a Date object
        if (wholeTournamentData.tournament) {
          const tournamentData = {
            ...wholeTournamentData.tournament,
            start_date: new Date(wholeTournamentData.tournament.start_date)
          };
          setTournamentDetails(tournamentData);
        } else {
          throw new Error("Tournament data not found in response.");
        }
      } catch (error: any) {
        console.error("Error fetching tournament details:", error);
        setError(error.message || "Failed to load tournament details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tournamentId]); // Depend on the numeric tournamentId

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputFields({...inputFields, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Clear previous submission errors
    setSuccessMessage(null); // Clear previous success messages

    if (!tournamentId || !inputFields.team_name.trim()) {
      setError("Team name is required.");
      return;
    }

    setIsSubmitting(true);

    // Create the registration data object matching CreateParticipantDTO
    const registrationData: CreateParticipantDTO = {
      tournament_id: tournamentId,
      name: inputFields.team_name.trim(), // Use trimmed team name
    };

    console.log("Submitting registration data:", registrationData);

    try {
      // Make the API call to register the team
      await registerParticipant(registrationData);
      console.log("Registration successful!");
      setSuccessMessage(`Successfully registered team "${registrationData.name}"!`);
      setInputFields({team_name: ""});
      // router.push(''); // Possibly redirect after success?
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  }

  // Common styles
  const labelStyle = {fontWeight: "500", color: "var(--text-color)"};
  const inputStyle = {
    color: "var(--text-color)",
    padding: "14px",
    borderRadius: "8px",
    backgroundColor: "var(--input-color)",
    border: "1px solid var(--border-color)",
  };

  // Loading State
  if (loading) {
    return <div style={{color: "var(--text-color)"}}>Loading tournament details...</div>;
  }

  // Error State (for loading tournament details)
  if (error && !tournamentDetails) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

  // Tournament Not Found State
  if (!tournamentDetails) {
    return <div style={{color: "var(--text-color)"}}>Tournament not found.</div>;
  }

  // Main Form Render
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "400px",
        maxWidth: "100%",
        padding: "24px",
        border: "1px solid var(--border-color)",
        borderRadius: "28px",
        backgroundColor: "var(--form-background)",
        color: "var(--text-color)",
      }}
    >
      {/* Display Tournament Details */}
      <div style={{marginBottom: "20px"}}>
        <h2 style={{marginBottom: "8px"}}>{tournamentDetails.name}</h2>

        {tournamentDetails && tournamentDetails.start_date && !isNaN(tournamentDetails.start_date.getTime()) ? (
          <>
            <p style={{marginBottom: "4px"}}>
              Date: {tournamentDetails.start_date.toLocaleDateString()}
            </p>
            <p style={{marginBottom: "4px"}}>
              Time: {tournamentDetails.start_date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </>
        ) : (
          // Fallback value
          <p style={{marginBottom: "4px"}}>Date/Time: N/A</p>
        )}

        {tournamentDetails && <p>Location: {tournamentDetails.location}</p>}
      </div>

      <Flex direction="column" gap="4">
        {/* Input Fields */}
        <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
          <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
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
              disabled={isSubmitting} // Disable input during submission
            />
          </div>
        </div>

        {/* Submission Feedback */}
        {error && <p style={{color: 'red', marginTop: '10px'}}>Error: {error}</p>}
        {successMessage && <p style={{color: 'green', marginTop: '10px'}}>{successMessage}</p>}

        {/* Submit Button */}
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
          disabled={isSubmitting || !inputFields.team_name.trim()} // Disable button during submission or if name is empty
        >
          {isSubmitting ? "Registering..." : "Register for Tournament"}
        </Button>
      </Flex>
    </form>
  );
}
