package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.entities.*
import com.turneringsportalen.backend.utils.createGroups
import com.turneringsportalen.backend.utils.scheduleExceptionGroups
import com.turneringsportalen.backend.utils.scheduleStandardGroups
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import org.springframework.stereotype.Service

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
        // Add Exceptions for when they should fail, currently only focused on getting it working
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
}
