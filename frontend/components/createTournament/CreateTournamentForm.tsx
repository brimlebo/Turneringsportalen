"use client"; // This component will render on the client side, required when using React hooks

import { CreateTournamentDTO, TournamentField } from "@/utils/types";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import SelectFieldNamingConvention from "./SelectFieldNamingConvention";
import { createTournament } from "@/utils/API";

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
    playing_fields: 1,
    time_between_matches: 0,
  });

  // Function to update the state when the input fields change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  // Function to handle the form submission
  function handleSubmit(fieldNames: string[]) {
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
              style={inputStyle}
            />
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
                style={inputStyle}
              />
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
                style={inputStyle}
              />
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
              style={inputStyle}
            />
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
              <label style={labelStyle} htmlFor="playing_fields">
                Number of Playing Fields
              </label>
              <input
                id="playing_fields"
                name="playing_fields"
                type="number"
                value={inputFields.playing_fields}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter the number of playing fields"
              />
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
                style={inputStyle}
              />
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
