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
 * Fetches only the basic Tournament data from the server by its id.
 * Designed for server-side use where related data (participants, schedule) isn't immediately needed.
 * @param id The id of the tournament to fetch
 * @returns The Tournament data or null if not found/error
 */
export async function fetchTournamentByIdBasic(
  id: number
): Promise<Tournament | null> {
  try {
    const response = await fetch(`${API_URL}/tournaments/${id}/basic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      console.log(`Tournament with ID ${id} not found (404).`);
      return null;
    }

    if (!response.ok) {
      console.error(
        `API Error: Failed to fetch basic tournament info for ${id}. Status: ${response.status}`
      );
      return null;
    }

    const tournamentData: Tournament = await response.json();

    if (
      tournamentData.tournament_id === undefined ||
      tournamentData.tournament_id === null
    ) {
      console.error(
        `API Error: Missing tournament_id in fetched basic data for ID ${id}`
      );
      return null;
    }

    return tournamentData;
  } catch (error) {
    console.error(`Error fetching basic tournament info by ID ${id}:`, error);
    return null;
  }
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

export async function registerParticipant(
  data: CreateParticipantDTO
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let backendError = `${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        if (errorBody) {
          backendError = errorBody;
          try {
            const parsedError = JSON.parse(errorBody);
            backendError =
              parsedError.message || parsedError.error || backendError;
          } catch (parseError) {}
        }
      } catch (readError) {
        console.error("Error reading error response body:", readError);
      }

      if (response.status === 409) {
        return {
          success: false,
          error: "Team name already registered for this tournament.",
        };
      }

      return { success: false, error: `Failed to register: ${backendError}` };
    }

    if (response.status !== 201) {
      console.warn(
        `Unexpected success status code: ${response.status}. Proceeding anyway.`
      );
    }

    revalidatePath(`/tournaments/${data.tournament_id}/registration`);
    revalidatePath(`/tournaments/${data.tournament_id}`);

    return { success: true };
  } catch (error: unknown) {
    console.error(
      "An unexpected error occurred registering participant:",
      error
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}
