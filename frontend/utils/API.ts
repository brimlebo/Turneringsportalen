"use server";
/**
 * This file contains the functions to communicate with the server
 */

import {
  CreateParticipantDTO,
  CreateTournamentDTO,
  Tournament,
  WholeTournamentDTO,
} from "./types";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Method that fetches the list of tournaments from the server
 * @returns The list of tournaments
 */
export async function fetchTournaments() {
  try {
    const supabase = await createClient();
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const response = await fetch(`${API_URL}/tournaments`, {
      method: "GET",
      cache: "no-store", // TEMP FOR TESTING, (MAYBE REMOVE LATER)
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("An error Occured: ", error);
    return Promise.reject(error.message);
  }
}

/**
 * Method that fetches a single tournament from the server by its id
 * @param id The id of the tournament to fetch
 * @returns The tournament with the given id
 */
export async function fetchTournamentById(
  id: number
): Promise<WholeTournamentDTO> {
  const response = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

/**
 * Function to send a POST request to the server to create a tournament
 * @param data The tournament object being created
 *
 */
export async function createTournament(data: CreateTournamentDTO) {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create tournament");
  }
  const tournament: Tournament = await response.json();

  console.log("Tournament created: ", tournament);

  return tournament;
}

/**
 * Function to send a POST request to the server to create the match schedule
 * @param tournament_id The id of the tournament
 */
export async function createMatchSchedule(tournament_id: number) {
  console.log("Creating match schedule for tournament: ", tournament_id);
  const response = await fetch(
    `${API_URL}/tournaments/${tournament_id}/schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create match schedule");
  }

  revalidatePath(`/tournaments/${tournament_id}`);
}

/**
 * Function to send a POST request to the server to register a participant (team) for a tournament
 * @param data The participant registration data
 */
export async function registerParticipant(data: CreateParticipantDTO): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      const errorBody = await response.text();
      // Try to parse backend error if it's JSON, otherwise use text
      let backendError = errorBody;
      try {
        const parsedError = JSON.parse(errorBody);
        backendError = parsedError.message || parsedError.error || errorBody;
      } catch (e) { /* Ignore parsing error, use raw text */ }

      throw new Error(`Failed to register participant: ${response.status} ${response.statusText}. ${backendError}`);
    }

    console.log('Participant registered successfully (201 Created)');

  } catch (error: any) {
    console.error('An error occurred registering participant:', error);
    throw new Error(error.message || 'Failed to register participant');
  }
}