/**
 * This file contains the functions to communicate with the server
 */

import { CreateTournamentDTO, Match, MatchParticipant } from "./types";

const API_URL = "http://localhost:8080";

/**
 * Method that fetches the list of tournaments from the server
 * @returns The list of tournaments
 */
export async function fetchTournaments() {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: "GET",
    cache: "no-store", // TEMP FOR TESTING, (MAYBE REMOVE LATER)
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
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

function test() {
  let matches: Match[] = [];
  const participants = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const minMatch = 3;
  const groupSize = 4;

  let groups = [];

  for (let i = 0; i < participants.length; i += groupSize) {
    if (i % groupSize === 1) {
      groups.push(participants.slice(i, participants.length - 1));
    } else {
      groups.push(participants.slice(i, i + groupSize));
    }
  }

  let matchParticipants: MatchParticipant[] = [];

  for (let group of groups) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const match = {
          match_id: 0,
          tournament_id: 1,
          time: new Date(),
          game_location_id: 1,
        };
        matches.push(match);
        matchParticipants.push({
          match_id: match.match_id,
          participant_id: 1,
          index: 1,
        });
        matchParticipants.push({
          match_id: match.match_id,
          participant_id: 2,
          index: 2,
        });
      }
    }
  }
}
