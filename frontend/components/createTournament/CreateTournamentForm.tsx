"use client"; // This component will render on the client side, required when using React hooks

import { CreateTournamentDTO, TournamentField } from "@/utils/types";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import SelectFieldNamingConvention from "./SelectFieldNamingConvention";
import { createTournament } from "@/utils/API";
import {
  validateInputString,
  validateNumbers,
  validateStartDate,
  validateStartTime,
} from "@/utils/validation";

interface ValidationErrors {
  name?: string;
  start_date?: string;
  start_time?: string;
  location?: string;
  minimum_matches?: string;
  playing_fields?: string;
  time_between_matches?: string;
}

/**
 * A component which contains the form to create a tournament
 * @returns The form to create a tournament
 */
export default function CreateTournamentForm() {
  // State to store the input fields as a single object to limit the amount of state variables
  const [inputFields, setInputFields] = useState({
    name: "",
    start_date: "",
    start_time: "",
    location: "",
    minimum_matches: 0,
    playing_fields: 1,
    time_between_matches: 0,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Function to update the state when the input fields change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  function validateForm(): boolean {
    const newErrors: ValidationErrors = {};

    newErrors.name = validateInputString(
      inputFields.name,
      3,
      60,
      "Tournament Name"
    );

    newErrors.location = validateInputString(
      inputFields.location,
      2,
      80,
      "Location"
    );

    newErrors.start_date = validateStartDate(inputFields.start_date);
    newErrors.start_time = validateStartTime(
      inputFields.start_time,
      inputFields.start_date
    );

    newErrors.playing_fields = validateNumbers(
      inputFields.playing_fields,
      1,
      200,
      "Number of Playing Fields"
    );

    newErrors.time_between_matches = validateNumbers(
      inputFields.time_between_matches,
      0,
      300,
      "Time Between Matches"
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Function to handle the form submission
  function handleSubmit(fieldNames: string[]) {
    if (!validateForm()) {
      return;
    }

    const [year, month, day] = inputFields.start_date.split("-").map(Number);
    const [hour, minute] = inputFields.start_time.split(":").map(Number);

    const startDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute)
    ).toISOString();

    const tournament: CreateTournamentDTO = {
      name: inputFields.name,
      start_date: startDate,
      location: inputFields.location,
      field_names: fieldNames,
      match_interval: inputFields.time_between_matches,
      minimum_matches: inputFields.minimum_matches,
    };

    createTournament(tournament);
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

  // Add error style
  const errorStyle = {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "2px",
  };

  return (
    <form
      style={{
        width: "600px",
        maxWidth: "100%",
        padding: "24px",
        border: "1px solid var(--border-color)",
        borderRadius: "28px",
        backgroundColor: "var(--form-background)",
        color: "var(--text-color)",
      }}
    >
      <Flex direction="column" gap="4">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={labelStyle} htmlFor="name">
              Tournament Name
            </label>
            <input
              id="name"
              name="name"
              value={inputFields.name}
              onChange={handleChange}
              placeholder="Enter the name of the tournament"
              pattern="^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$"
              required
              minLength={3}
              maxLength={60}
              style={{
                ...inputStyle,
                borderColor: errors.name ? "red" : "var(--border-color)",
              }}
            />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label style={labelStyle} htmlFor="start_date">
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={inputFields.start_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(new Date().setFullYear(new Date().getFullYear() + 2))
                    .toISOString()
                    .split("T")[0]
                }
                style={{
                  ...inputStyle,
                  borderColor: errors.start_date
                    ? "red"
                    : "var(--border-color)",
                }}
              />
              {errors.start_date && (
                <span style={errorStyle}>{errors.start_date}</span>
              )}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label style={labelStyle} htmlFor="start_time">
                Start Time
              </label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                value={inputFields.start_time}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  borderColor: errors.start_time
                    ? "red"
                    : "var(--border-color)",
                }}
              />
              {errors.start_time && (
                <span style={errorStyle}>{errors.start_time}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={labelStyle} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Enter the location of the tournament"
              value={inputFields.location}
              onChange={handleChange}
              pattern="^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$"
              required
              minLength={2}
              maxLength={80}
              style={{
                ...inputStyle,
                borderColor: errors.location ? "red" : "var(--border-color)",
              }}
            />
            {errors.location && (
              <span style={errorStyle}>{errors.location}</span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label style={labelStyle} htmlFor="playing_fields">
                Matches per participant
              </label>
              <input
                id="minimum_matches"
                name="minimum_matches"
                type="number"
                value={inputFields.minimum_matches}
                onChange={handleChange}
                required
                min={1}
                max={10}
                style={{
                  ...inputStyle,
                  borderColor: errors.minimum_matches
                    ? "red"
                    : "var(--border-color)",
                }}
                placeholder="Enter the number of minimum matches per participant"
              />
              {errors.minimum_matches && (
                <span style={errorStyle}>{errors.playing_fields}</span>
              )}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label style={labelStyle} htmlFor="playing_fields">
                Number of Playing Fields
              </label>
              <input
                id="playing_fields"
                name="playing_fields"
                type="number"
                value={inputFields.playing_fields}
                onChange={handleChange}
                required
                min={1}
                max={200}
                style={{
                  ...inputStyle,
                  borderColor: errors.playing_fields
                    ? "red"
                    : "var(--border-color)",
                }}
                placeholder="Enter the number of playing fields"
              />
              {errors.playing_fields && (
                <span style={errorStyle}>{errors.playing_fields}</span>
              )}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label style={labelStyle} htmlFor="time_between_matches">
                Time Between Matches (minutes)
              </label>
              <input
                id="time_between_matches"
                name="time_between_matches"
                type="number"
                value={inputFields.time_between_matches}
                onChange={handleChange}
                required
                min={0}
                max={300}
                style={{
                  ...inputStyle,
                  borderColor: errors.time_between_matches
                    ? "red"
                    : "var(--border-color)",
                }}
                placeholder="Enter the time between matches in minutes"
              />
              {errors.time_between_matches && (
                <span style={errorStyle}>{errors.time_between_matches}</span>
              )}
            </div>
          </div>
        </div>
        <SelectFieldNamingConvention
          onSubmit={handleSubmit}
          fieldCount={inputFields.playing_fields}
        />
      </Flex>
    </form>
  );
}
