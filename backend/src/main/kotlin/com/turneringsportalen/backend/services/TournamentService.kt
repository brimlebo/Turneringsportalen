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
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.datetime.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter
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

        for (matchDTO in finalMatches) {
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
        return client.from("tournament").insert(tournament) { select() }.decodeSingle<Tournament>()
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
        val savedMatch = client.from("match").insert(match) { select() }.decodeSingle<Match>()

        for ((index, participant) in participants.withIndex()) {
            client.from("match_participant")
                .insert(MatchParticipant(savedMatch.matchId, participant.participantId ?: 0, index))
        }
    }

    suspend fun getSchedule(tournamentId: Int): List<MatchOverviewDTO> {
        val rawColumns = """
        match_id,
        time,
        available_fields (
          field_id,
          field_name
        ),
        match_participant (
          participant_id,
          participant (
            name
          )
        )
    """.trimIndent()

        val rows = client
            .from("match")
            .select(columns = Columns.raw(rawColumns)) {
                filter {
                    eq("tournament_id", tournamentId)
                }
            }
            .decodeList<RawMatchRow>()

        return rows.map { row ->
            val localDateTime = Instant.parse(row.time.toString()).toLocalDateTime(TimeZone.currentSystemDefault())

            MatchOverviewDTO(
                matchId = row.matchId,
                date = "%02d.%02d".format(localDateTime.date.dayOfMonth, localDateTime.date.monthNumber),
                time = "%02d.%02d".format(localDateTime.hour, localDateTime.minute),
                gameLocation = GameLocationDTO(row.field.fieldId, row.field.fieldName),
                participants = row.matchParticipant.mapNotNull { mp ->
                    mp.participantId?.let {
                        SimpleParticipantDTO(
                            participantId = it,
                            name = mp.participant.name
                        )
                    }
                }
            )
        }
    }


// --- helper data classes for intermediate decoding ---
    @Serializable
    data class RawMatchRow(
    @SerialName("match_id") val matchId: Int,
    val time: Instant,
    @SerialName("available_fields") val field: FieldRow,
    @SerialName("match_participant") val matchParticipant: List<ParticipantRow>
    )

    @Serializable
    data class FieldRow(
        @SerialName("field_id") val fieldId: Int,
        @SerialName("field_name") val fieldName: String
    )

    @Serializable
    data class ParticipantRow(
        @SerialName("participant_id") val participantId: Int?,
        val participant: ParticipantNameRow
    )

    @Serializable
    data class ParticipantNameRow(
        val name: String
    )

}
