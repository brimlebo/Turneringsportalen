/**
 * This file contains the functions to communicate with the server
 */

//import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { CreateTournamentDTO } from "./types";


const API_URL = "http://localhost:8080";

/**
 * Method that fetches the list of tournaments from the server
 * @returns The list of tournaments
 */
export async function fetchTournaments() {
  try {
    const supabase = await createClient();
    const token = ((await supabase.auth.getSession()).data.session?.access_token)
    const response = await fetch(`${API_URL}/tournaments`, {
      method: "GET",
      cache: "no-store", // TEMP FOR TESTING, (MAYBE REMOVE LATER)
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {

      throw new Error(`Fetch error: ${response.status}`)
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("An error Occured: ", error)
  } 
  
}

/**
 * Method that fetches a single tournament from the server by its id
 * @param id The id of the tournament to fetch
 * @returns The tournament with the given id
 */
export async function fetchTournamentById(id: number) {
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

  if (!response.ok) {
    throw new Error("Failed to create tournament");
  }
}
