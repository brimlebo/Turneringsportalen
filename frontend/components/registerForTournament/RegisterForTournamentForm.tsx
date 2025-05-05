"use client"; // This component will render on the client side, required when using React hooks

import React, { useState } from "react";
import { Button, Flex } from "@radix-ui/themes";
import { Tournament, CreateParticipantDTO } from "@/utils/types";
import { registerParticipant } from "@/utils/API";
import { useRouter } from "next/navigation";
import { validateInputString } from "@/utils/validation";

// Define props for the form component
interface RegisterForTournamentFormProps {
  tournament: Tournament; // Receive tournament data as a prop
}

// Define state for validation errors (matching the structure used in CreateTournamentForm)
interface ValidationErrors {
  name?: string; // Error message for the team name field
}

/**
 * A component which contains the form to register for a tournament
 * @param {RegisterForTournamentFormProps} props - Component props including tournament data
 * @returns The form to register for a tournament
 */
export default function RegisterForTournamentForm({
  tournament,
}: RegisterForTournamentFormProps) {
  // Get tournament ID directly from the prop
  const tournamentId = tournament.tournament_id;

  // State for input fields
  const [inputFields, setInputFields] = useState({
    team_name: "",
  });

  // State for validation errors displayed next to fields
  const [errors, setErrors] = useState<ValidationErrors>({});

  // State for submission status and general submission errors/success messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // Update input field state on change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof ValidationErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  }

  function validateForm(): boolean {
    const newErrors: ValidationErrors = {};

    // Validate Team Name
    newErrors.name = validateInputString(
      inputFields.team_name.trim(), // Use trimmed value for validation
      3, // Min length
      60, // Max length
      "Team Name" // Field name for error message
    );

    setErrors(newErrors); // Update the errors state

    // Return true if there are no errors (all values in newErrors are undefined)
    return !Object.values(newErrors).some((error) => error !== undefined);
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null); // Clear previous submission errors
    setSuccessMessage(null);

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    if (tournamentId === undefined || tournamentId === null) {
      console.error("Form Error: Tournament ID is missing.");
      setSubmitError("Cannot register: Tournament information is incomplete.");
      return;
    }

    setIsSubmitting(true);

    const registrationData: CreateParticipantDTO = {
      tournament_id: tournamentId, // Use ID from props
      name: inputFields.team_name.trim(),
    };

    try {
      await registerParticipant(registrationData);
      setSuccessMessage(
        `Successfully registered team "${registrationData.name}"! Redirecting to tournament page...`
      );
      setInputFields({ team_name: "" }); // Clear form after successful submission
      setErrors({}); // Clear errors on success
      router.push(`/tournaments/${tournamentId}`);
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Use the error message thrown by the API function
      setSubmitError(
        error.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Common styles
  const labelStyle = { fontWeight: "550", color: "var(--highlighter2)" };
  const inputStyle = {
    color: "var(--highlighter1)",
    padding: "14px",
    borderRadius: "8px",
    backgroundColor: "var(--input-color)",
    border: "1px solid var(--border-color)",
    width: "100%",

    boxSizing: "border-box" as "border-box", // Include padding/border in width
  };
  // Error message style
  const errorStyle = {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "2px",
  };

  // Convert start_date string from props to Date object *for display only*
  let displayDate: Date | null = null;
  if (tournament.start_date) {
    try {
      displayDate = new Date(tournament.start_date);
      if (isNaN(displayDate.getTime())) {
        displayDate = null;
        console.warn(
          "Invalid start_date string received:",
          tournament.start_date
        );
      }
    } catch (e) {
      console.error("Error parsing start_date:", e);
      displayDate = null;
    }
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
        backgroundColor: "var(--secondaryBg)",
        color: "var(--text-color)",
      }}
      noValidate // Prevent default browser validation, rely on our custom validation
    >
      {/* Display Tournament Details */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "8px", color: "var(--highlighter2)" }}>
          {tournament.name}
        </h2>
        {displayDate ? (
          <>
            <p style={{ marginBottom: "4px", color: "var(--highlighter1)" }}>
              <span style={{ color: "var(--highlighter2", fontWeight: 550 }}>
                Date:{" "}
              </span>{" "}
              {displayDate.toLocaleDateString()}
            </p>
            <p style={{ marginBottom: "4px", color: "var(--highlighter1)" }}>
              <span style={{ color: "var(--highlighter2", fontWeight: 550 }}>
                Time:{" "}
              </span>
              {displayDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        ) : (
          <p style={{ marginBottom: "4px", color: "var(--highlighter1)" }}>
            Date/Time: N/A
          </p>
        )}
        <p style={{ color: "var(--highlighter1)" }}>
          <span style={{ color: "var(--highlighter2)", fontWeight: 550 }}>
            Location:{" "}
          </span>
          {tournament.location}
        </p>
      </div>

      <Flex direction="column" gap="4">
        {/* Input Fields */}
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
              // Apply conditional styling for error
              style={{
                ...inputStyle,
                borderColor: errors.name ? "red" : "var(--border-color)",
              }}
              disabled={isSubmitting}
              aria-invalid={!!errors.name} // Accessibility: indicate invalid input
              aria-describedby={errors.name ? "team-name-error" : undefined} // Link input to error message
            />
            {/* Display Validation Error Message */}
            {errors.name && (
              <span id="team-name-error" style={errorStyle} role="alert">
                {errors.name}
              </span>
            )}
          </div>
        </div>

        {/* General Submission Feedback */}
        {submitError && (
          <p style={{ color: "red", marginTop: "10px" }} role="alert">
            Error: {submitError}
          </p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }} role="status">
            {successMessage}
          </p>
        )}

        {/* Submit Button */}
        <Button
          style={{
            width: "fit-content",
            backgroundColor: "var(--highlighter3)",
            color: "var(--text-color)",
            padding: "20px",
            borderRadius: "9999px",
            fontSize: "16px",
            cursor:
              isSubmitting || !inputFields.team_name.trim()
                ? "not-allowed"
                : "pointer", // Keep basic check for immediate disabled state
            opacity: isSubmitting || !inputFields.team_name.trim() ? 0.8 : 1, // Visual cue for disabled
          }}
          type="submit"
          disabled={isSubmitting || !inputFields.team_name.trim()} // Disable during submission or if empty
        >
          {isSubmitting ? "Registering..." : "Register for Tournament"}
        </Button>
      </Flex>
    </form>
  );
}
