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
 * Method that fetches a single tournament from the server by its id
 * @param id The id of the tournament to fetch
 * @returns The tournament data or null if not found/error
 */
export async function fetchTournamentByIdServer(
  id: number
): Promise<Tournament | null> {
  try {
    const response = await fetch(`${API_URL}/tournaments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      // Log server-side error for debugging
      console.error(
        `API Error: Failed to fetch tournament ${id}. Status: ${response.status}`
      );
      return null;
    }

    const data: WholeTournamentDTO = await response.json();

    if (!data.tournament) {
      console.error(
        `API Error: Tournament data missing in response for ID ${id}`
      );
      return null;
    }

    const tournamentData = {
      ...data.tournament,
      start_date: data.tournament.start_date,
      tournament_id:
        data.tournament.tournament_id || data.tournament.tournamentId,
    };

    // Validate that the essential ID is present
    if (
      tournamentData.tournament_id === undefined ||
      tournamentData.tournament_id === null
    ) {
      console.error(
        `API Error: Missing tournament_id in fetched data for ID ${id}`
      );
      return null;
    }

    return tournamentData as Tournament;
  } catch (error) {
    console.error(`Error fetching tournament by ID ${id}:`, error);
    return null; // Return null on fetch errors too
  }
}

/**
 * Function to send a POST request to the server to register a participant (team) for a tournament
 * This function should remain mostly the same as it's called from the client form.
 * @param data The participant registration data
 */
export async function registerParticipant(
  data: CreateParticipantDTO
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      throw new Error("Team name already registered for this tournament.");
    }

    if (response.status !== 201) {
      const errorBody = await response.text();
      let backendError = errorBody;
      try {
        const parsedError = JSON.parse(errorBody);
        backendError = parsedError.message || parsedError.error || errorBody;
      } catch (e) {
        /* Ignore parsing error */
      }
      throw new Error(
        `Failed to register: ${backendError || response.statusText}`
      );
    }
    revalidatePath(`/tournaments/${data.tournament_id}/registration`);
    revalidatePath(`/tournaments/${data.tournament_id}`);
  } catch (error: unknown) {
    console.error("An error occurred registering participant:", error);
    throw error;
  }
}
