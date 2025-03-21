package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.dto.MatchOverviewDTO
import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.entities.*
import com.turneringsportalen.backend.utils.*
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import org.springframework.stereotype.Service
import kotlin.time.Duration.Companion.minutes

@Service
class TournamentService(private val client: SupabaseClient) {

    // Function for the overarching algorithm of the app, automatically setting up a match schedule given a tournament, participants and playing fields exist.
    // Gives back a list of matches so that the webpage can display them and so that changes might be made
    suspend fun setUpMatches(tournamentId: Int): List<MatchOverviewDTO> {
        val tournament: Tournament? = findTournamentById(tournamentId);

        if(tournament == null) return emptyList();
        val minimumMatches = 3
        val standardGroupSize = minimumMatches + 1
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

        val groupSize = minimumMatches + 1
        val groups = createGroups(participants, minimumMatches)

        // Schedule matches per group and retain group structure
        val matchesPerGroup = mutableListOf<MutableList<MatchWithParticipantsDTO>>()
        for ((index, group) in groups.withIndex()) {
            val groupMatches = if (group.size == standardGroupSize) {
                scheduleStandardGroups(group, minimumMatches, tournament, fields).toMutableList()
            } else {
                scheduleExceptionGroups(group, minimumMatches, group.size, tournament, fields).toMutableList()
            }
            matchesPerGroup.add(index, groupMatches)
        }

        // Assign time and field per pair of groups
        val finalMatches = mutableListOf<MatchWithParticipantsDTO>()
        var startingTime = tournament.startDate

        for (i in matchesPerGroup.indices step 2) {
            if (i + 1 < matchesPerGroup.size) {
                // Paired groups
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(fields[0], fields[1]),
                    matchesPerGroup[i],
                    startingTime,
                    groups[i]
                )
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(fields[2], fields[3]),
                    matchesPerGroup[i + 1],
                    startingTime,
                    groups[i + 1]
                )
            } else {
                // Unpaired group (last odd group)
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    fields,
                    matchesPerGroup[i],
                    startingTime,
                    groups[i]
                )
            }

            // Advance timeslot by 3 * matchInterval minutes
            startingTime = startingTime.plus((tournament.matchInterval * 3).minutes)
        }
        
        return mapMatchesToOverviewList(finalMatches, fields)
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

    suspend fun findMatchParticipantsByMatchId(id: Int): List<MatchParticipant>? {
        return client.from("match_participant").select {
            filter {
                eq("participant_id", id)
            }
        }.decodeList<MatchParticipant>()
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
