package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.*
import org.springframework.stereotype.Service
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Instant

@Service
class TournamentService(private val client: SupabaseClient) {

    // Function for the overarching algorithm of the app, automatically setting up a match schedule given a tournament, participants and playing fields exist.
    // Gives back a list of matches so that the webpage can display them and so that changes might be made
    suspend fun setUpMatches(tournamentId: Int) /*: List<Match>*/ {
        // Todo: Set up this damn thing
    }

    suspend fun createTournament(tournament: Tournament) {
        client.from("tournament").insert(tournament)
    }


    suspend fun addParticipant(participant: Participant) {
        client.from("participant").insert(participant)
    }

    suspend fun addMatch(match: Match, participants: List<Participant>) {
        client.from("match").insert(match)

        for ((index, participant) in participants.withIndex()) {
            client.from("match_participant").insert(MatchParticipant(match.matchId, participant.participantId, index))
        }
    }

    suspend fun findAllTournaments(): List<Tournament>? {
        return client.from("tournament").select().decodeList<Tournament>()
    }

    suspend fun findById(id: Int): Tournament? {
        return client.from("tournament").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeSingle<Tournament>()
    }

    suspend fun findMatchById(id: Int): Match? {
        return client.from("match").select {
            filter {
                eq("match_id", id)
            }
        }.decodeSingle<Match>()
    }

    suspend fun findMatchesByTournamentId(id: Int): List<Match>? {
        return client.from("match").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeList<Match>()
    }

    suspend fun findFieldsByTournamentId(id: Int): List<TournamentField>? {
        return client.from("available_fields").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeList<TournamentField>()
    }

    suspend fun findParticipantById(id: Int): Match? {
        return client.from("participant").select {
            filter {
                eq("participant_id", id)
            }
        }.decodeSingle<Match>()
    }

    suspend fun findMatchParticipantByMatchId(id: Int): List<MatchParticipant>? {
        return client.from("match_participant").select {
            filter {
                eq("participant_id", id)
            }
        }.decodeList<MatchParticipant>()
    }

    suspend fun deleteTournament(id: Int) {     // Change supabase so if a tournament is deleted it cascades
        // Add Exceptions for when they should fail, currently only focused on getting it working
        client.from("tournament").delete {
            filter {
                eq("tournament_id", id)
            }
        }
    }

    suspend fun deleteParticipant(id: Int) {     // Change supabase so if a tournament is deleted it cascades
        // Add Exceptions for when they should fail, currently only focused on getting it working
        client.from("participant").delete {
            filter {
                eq("participant_id", id)
            }
        }
    }

    suspend fun deleteMatch(id: Int) {     // Change supabase so if a tournament is deleted it cascades
        // Add Exceptions for when they should fail, currently only focused on getting it working
        client.from("match").delete {
            filter {
                eq("match_id", id)
            }
        }
    }

    suspend fun update(tournamentId: Int, name: String, startDate: Instant, location: String, matchInterval: Int) {
        client.from("tournament").update(
            {
                set("tournament_id", tournamentId)
                set("name", name)
                set("start_date", startDate)
                set("location", location)
                set("match_interval", matchInterval)
            }
        ) {
            filter {
                eq("tournament_id", tournamentId)
            }
        }
    }
}