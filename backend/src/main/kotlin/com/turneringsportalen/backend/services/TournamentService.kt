package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.dto.GameLocationDTO
import com.turneringsportalen.backend.dto.MatchOverviewDTO
import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.dto.WholeTournamentDTO
import com.turneringsportalen.backend.dto.SimpleParticipantDTO
import com.turneringsportalen.backend.entities.*
import com.turneringsportalen.backend.utils.*
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.springframework.stereotype.Service
import kotlin.time.Duration.Companion.minutes

// Import other services here so their functions can be used in the "main" service?
@Service
class TournamentService(private val client: SupabaseClient, private val participantsService: ParticipantService) {

    // Function for the overarching algorithm of the app, automatically setting up a match schedule given a tournament, participants and playing fields exist.
    // Gives back a list of matches so that the webpage can display them and so that changes might be made
    suspend fun setUpMatches(tournamentId: Int): List<MatchOverviewDTO> {
        val tournament: Tournament = findTournamentById(tournamentId) ?: return emptyList()

        val minimumMatches = tournament.minimumMatches ?: 0
        val standardGroupSize = minimumMatches + 1
        val participants = findAllTournamentParticipants(tournamentId) ?: return emptyList()

        val fields = findFieldsByTournamentId(tournamentId) ?: return emptyList()

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

        // Assign time and field for each pair of groups
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

        for(matchDTO in finalMatches) {
            val match = Match(null, tournamentId, matchDTO.time ?: Clock.System.now(), matchDTO.gameLocationId)
            val matchParticipants = mutableListOf<Participant>()
            for (participant in matchDTO.participants) {
                matchParticipants.add(participant.participant)
            }
            addMatchAndParticipants(match, matchParticipants)
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

    // Should only be used if a tournament has passed its registration end date and/or a schedule has been set up for the given tournament
    suspend fun findTournamentWithSchedule(id: Int): WholeTournamentDTO? {
        val tournament = findTournamentById(id)
            ?: throw Exception("No tournament")

        val participants = findAllTournamentParticipants(id)
            ?: emptyList()

        val fields = findFieldsByTournamentId(id)
            ?: throw Exception("No fields")

        val schedule = getSchedule(id)

        val tournamentReturn = WholeTournamentDTO(
            tournament,
            participants,
            schedule,
            fields
        )

        return tournamentReturn
    }

    suspend fun findMatchParticipantsByMatchId(id: Int): List<Participant>? {
        val matchParticipants = client.from("match_participant").select {
            filter {
                eq("match_id", id)
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

    // Adds "whole" match in one, match and its participants to relevant tables, use case is more for the algorithm after it has generated a schedule
    // Unsure if it needs an api-endpoint, might be better to have an "in bulk" version in the tournamentService for editing after schedule has been created
    suspend fun addMatchAndParticipants(match: Match, participants: List<Participant>) {
        val savedMatch = client.from("match").insert(match){ select() }.decodeSingle<Match>()

        for ((index, participant) in participants.withIndex()) {
            client.from("match_participant").insert(MatchParticipant(savedMatch.matchId, participant.participantId ?: 0, index))
        }
    }

    // TEMP GETTING SCHEDULE
    suspend fun getSchedule(tournamentId: Int): List<MatchOverviewDTO> {
        val matches = findMatchesByTournamentId(tournamentId) ?: return listOf()
        val fields = findFieldsByTournamentId(tournamentId) ?: return listOf()

        val schedule = mutableListOf<MatchOverviewDTO>()

        for (match in matches) {
            val matchParticipants = match.matchId?.let { findMatchParticipantsByMatchId(it) } ?: listOf()
            val participantsDTO = matchParticipants.mapNotNull { matchParticipant ->
                val participant = matchParticipant.participantId?.let { participantsService.findParticipantById(it) }
                participant?.let {
                    SimpleParticipantDTO(
                        participantId = matchParticipant.participantId,
                        name = it.name
                    )
                }
            }.toMutableList()

            // Convert the Instant to a local date/time.
            val localDateTime = match.time.toLocalDateTime(TimeZone.currentSystemDefault())

            // Format date as dd.MM (day and month)
            val day = localDateTime.date.dayOfMonth
            val month = localDateTime.date.monthNumber
            val dateString = "%02d.%02d".format(day, month)

            // Format time as hh:mm (hour and minute)
            val hour = localDateTime.time.hour
            val minute = localDateTime.time.minute
            val timeString = "%02d:%02d".format(hour, minute)

            schedule.add(MatchOverviewDTO(match.matchId, dateString, timeString, GameLocationDTO(match.gameLocationId, fields.find { it.fieldId == match.gameLocationId }?.fieldName ?: ""), participantsDTO))
        }

        return schedule
    }
}
