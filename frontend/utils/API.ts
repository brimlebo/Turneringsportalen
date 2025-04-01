/**
 * This file contains the functions to communicate with the server
 */

import {
  CreateTournamentDTO,
  Match,
  MatchOverviewDTO,
  MatchParticipant,
  WholeTournamentDTO,
} from "./types";
import { createClient } from "./supabase/server";

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
    cache: "no-store", // TEMP FOR TESTING
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
}

// TESTING, VERY TEMPORARY
export async function test(): Promise<MatchOverviewDTO[]> {
  const response = await fetch(`${API_URL}/test`, {
    method: "GET",
    cache: "no-store", // TEMP FOR TESTING, (MAYBE REMOVE LATER)
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export async function editTournament(data: {
  tournament_id: number,
  name: string,
  start_date: string, 
  location: string, 
  match_interval: number
}){
const response = await fetch(`${API_URL}/tournaments/${data.tournament_id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

  if (!response.ok){
    const errorText = await response.text();
    console.error("Failed to edit tournament:", errorText);
    throw new Error(errorText);
  }
  if (response.status === 204) {
    return null; // No Content
  }
}



export async function updateMatch(data: Match) {

    const response = await fetch(`${API_URL}/match/${data.match_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  

