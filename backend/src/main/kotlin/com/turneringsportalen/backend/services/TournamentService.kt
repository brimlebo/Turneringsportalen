package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.dto.ReturnMatchDTO
import com.turneringsportalen.backend.dto.WholeTournamentDTO
import com.turneringsportalen.backend.entities.*
import com.turneringsportalen.backend.utils.createGroups
import com.turneringsportalen.backend.utils.scheduleExceptionGroups
import com.turneringsportalen.backend.utils.scheduleStandardGroups
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

// Import other services here so their functions can be used in the "main" service?
@Service
class TournamentService(private val client: SupabaseClient) {

    // Function for the overarching algorithm of the app, automatically setting up a match schedule given a tournament, participants and playing fields exist.
    // Gives back a list of matches so that the webpage can display them and so that changes might be made
    suspend fun setUpMatches(tournamentId: Int): List<MatchWithParticipantsDTO> {
        val tournament = Tournament(tournamentId, "Test Tournament", Clock.System.now(), "Test Location", 30)
        val minimumMatches = 3
        val participants = listOf(
            Participant(1, tournamentId, "Trane gul"),
            Participant(2, tournamentId, "Trane grønn"),
            Participant(3, tournamentId, "Trane rød"),
            Participant(4, tournamentId, "Trane svart"),
            Participant(5, tournamentId, "Varegg gul"),
            Participant(6, tournamentId, "Varegg blå"),
            Participant(7, tournamentId, "Varegg lilla"),
            Participant(8, tournamentId, "Varegg svart"),
            Participant(9, tournamentId, "Varegg hvit"),
            Participant(10, tournamentId, "Nordnes gul"),
            /* Participant(11, 1, "Nordnes svart"),
            Participant(12, 1, "Baune svart"),
             Participant(13, 1, "Nymark svart"),
             Participant(14, 1, "Nymark hvit"),
             Participant(15, 1, "Nymark rød"),
             Participant(16, 1, "Nymark grå"),
             Participant(17, 1, "Gneist hvit"),
             Participant(18, 1, "Gneist blå"),
             Participant(19, 1, "Gneist rød"),
             Participant(20, 1, "Brann hvit"),
             Participant(21, 1, "Brann rød"),
             Participant(22, 1, "Brann svart"), */
        )

        val fields = listOf(
            TournamentField(1, tournamentId, "Field A"),
            TournamentField(2, tournamentId, "Field B"),
            TournamentField(3, tournamentId, "Field C"),
            TournamentField(4, tournamentId, "Field D")
        )

        val matches: MutableList<MatchWithParticipantsDTO> = mutableListOf()
        val groupSize = minimumMatches + 1
        val groups = createGroups(participants, minimumMatches)

        for (group in groups) {
            if (group.size == groupSize) {
                // Standard group pairing (all-vs-all)
                matches += scheduleStandardGroups(group, minimumMatches, tournament, fields)
            } else {
                matches += scheduleExceptionGroups(group, minimumMatches, group.size, tournament, fields)
            }
        }



        for (match in matches) {
            for (participant in match.participants) {
                println(participant.participant.name)
            }
        }

        return matches
    }

    suspend fun createTournament(tournament: Tournament): Tournament {
        return client.from("tournament").insert(tournament){ select() }.decodeSingle<Tournament>()
    }

    suspend fun findAllTournaments(): List<Tournament>? {
        return client.from("tournament").select().decodeList<Tournament>()
    }

    suspend fun findTournamentById(id: Int): Tournament? {
        return client.from("tournament").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeSingle<Tournament>()
    }

    suspend fun deleteTournament(id: Int) {
        client.from("tournament").delete {
            filter {
                eq("tournament_id", id)
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

    // Functions for finding data from other tables relevant for a given tournament

    // Should only be used if a tournament has passed its registration end date and/or a schedule has been set up for the given tournament
    suspend fun findTournamentWithSchedule(id: Int): ResponseEntity<WholeTournamentDTO> {
        val tournament = findTournamentById(id)
        val participants = findAllTournamentParticipants(id)
        val fields = findFieldsByTournamentId(id)

        val matches = findMatchesByTournamentId(id)

        if (tournament == null || participants == null || fields == null || matches == null) {
            throw IllegalArgumentException("Does not exist, or schedule has not been created")
        }

        val matchParticipants: MutableList<List<Participant>> = mutableListOf()
        for (match in matches) {
            findMatchParticipantsByMatchId(match.matchId)?.let { matchParticipants.add(it) }
        }

        val matchesWithParticipants = matches.zip(matchParticipants) { f1, f2 -> ReturnMatchDTO(f1, f2) }

        val tournamentReturn = WholeTournamentDTO(
            tournament,
            participants,
            matchesWithParticipants,
            fields
        )

        return ResponseEntity(tournamentReturn, HttpStatus.OK)
    }

    // Changed to return the participant objects instead of MatchParticipant
    suspend fun findMatchParticipantsByMatchId(id: Int): List<Participant>? {
        val matchParticipants = client.from("match_participant").select {
            filter {
                eq("participant_id", id)
            }
        }.decodeList<MatchParticipant>()

        val participants: MutableList<Participant> = mutableListOf()
        for (mParticipant in matchParticipants) {   // Get ParticipantService and use findMatchParticipantById()?
            val participant = client.from("participant").select {
                filter {
                    eq("participant_id", mParticipant.participantId)
                }
            }.decodeSingle<Participant>()

            participants.add(participant)
        }

        return participants
    }

    suspend fun findMatchesByTournamentId(id: Int): List<Match>? {
        return client.from("match").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeList<Match>()
    }

    suspend fun findAllTournamentParticipants(id: Int): List<Participant>? {
        return client.from("participant").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeList<Participant>()
    }

    suspend fun findFieldsByTournamentId(id: Int): List<TournamentField>? {
        return client.from("available_fields").select {
            filter {
                eq("tournament_id", id)
            }
        }.decodeList<TournamentField>()
    }
}
