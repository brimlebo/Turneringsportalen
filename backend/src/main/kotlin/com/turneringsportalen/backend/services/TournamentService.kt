package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.dto.MatchParticipantWithParticipantDTO
import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.entities.*
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
        val tournament: Tournament = Tournament(-1, "Test Tournament", Clock.System.now(), "Test Location", 30)
        val minimumMatches = 3
        val participants = listOf(
            Participant(1, 1, "Trane gul"),
            Participant(2, 1, "Trane grønn"),
            Participant(3, 1, "Trane rød"),
            Participant(4, 1, "Trane svart"),
            Participant(5, 1, "Varegg gul"),
            Participant(6, 1, "Varegg blå"),
            Participant(7, 1, "Varegg lilla"),
            Participant(8, 1, "Varegg svart"),
            Participant(9, 1, "Varegg hvit"),
            Participant(10, 1, "Nordnes gul"),
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
        );

        val fields = listOf(
            TournamentField(1, 1, "Field A"),
            TournamentField(2, 1, "Field B"),
            TournamentField(3, 1, "Field C"),
            TournamentField(4, 1, "Field D")
        )

        val matches: MutableList<MatchWithParticipantsDTO> = mutableListOf()
        val groupSize = 4
        val groups = mutableListOf<List<Participant>>()

        var i = 0
        while (i < participants.size) {
            val remaining = participants.size - i

            // If remaining participants are more than one full group but not enough for two full groups, merge them all into one
            if (remaining in (groupSize + 1) until (2 * groupSize)) {
                groups.add(participants.subList(i, participants.size)) // One final large group
                break
            } else {
                groups.add(participants.subList(i, minOf(i + groupSize, participants.size)))
                i += groupSize
            }
        }


        for (group in groups) {
            for (participant in group) {
                println(participant.name)
            }
            println()
        }

        var matchid = 0;

        for (group in groups) {
            if (group.size == groupSize) {
                // Standard group pairing (all-vs-all)
                for (i in group.indices) {
                    for (j in i + 1 until groupSize) {
                        val match = MatchWithParticipantsDTO(
                            matchId = matchid,
                            tournamentID = tournament.tournamentId ?: -1,
                            time = Clock.System.now(),
                            gameLocationId = fields[0].fieldId ?: -1,
                            participants = listOf(
                                MatchParticipantWithParticipantDTO(
                                    matchId = matchid, participant = group[i], index = 1
                                ), MatchParticipantWithParticipantDTO(
                                    matchId = matchid, participant = group[j], index = 2
                                )
                            )
                        )
                        matchid++
                        matches.add(match)
                    }
                }
            } else {
                // Exception when group has more members than normal group size

                // Track min matches
                val matchCount = mutableMapOf<Int, Int>()  // Track match count per participant
                // sets each participant on each participantId in the group to 0
                group.forEach { matchCount[it.participantId ?: Int.MAX_VALUE] = 0 }

                val matchSplitter = Math.ceil(group.size.toDouble() / 2).toInt()
                val isEven = group.size % 2 == 0;

                for (i in group.indices) {
                    val participantI = group[i]

                    for (j in matchSplitter until minOf(group.size, matchSplitter*2)) {
                        val participantJ = group[j]

                        // Ensure participant J and I has less than 3 matches before continuing
                        if ((matchCount[participantJ.participantId]
                                ?: 0) != 3 && (matchCount[participantI.participantId] ?: 0) != 3
                        ) {
                            val match = MatchWithParticipantsDTO(
                                matchId = matchid,
                                tournamentID = tournament.tournamentId ?: -1,
                                time = Clock.System.now(),
                                gameLocationId = fields[0].fieldId ?: -1,
                                participants = listOf(
                                    MatchParticipantWithParticipantDTO(
                                        matchId = matchid,
                                        participant = participantI,
                                        index = 1
                                    ),
                                    MatchParticipantWithParticipantDTO(
                                        matchId = matchid,
                                        participant = participantJ,
                                        index = 2
                                    )
                                )
                            )
                            matchid++
                            matches.add(match)

                            // Increment match count for both participants
                            matchCount[participantI.participantId ?: Int.MAX_VALUE] =
                                (matchCount[participantI.participantId] ?: 0) + 1
                            matchCount[participantJ.participantId ?: Int.MAX_VALUE] =
                                (matchCount[participantJ.participantId] ?: 0) + 1

                            for (count in matchCount) {
                                println(count)
                            }
                            println()
                        }
                    }
                }
                if (!isEven) {
                    // Loop through the first `matchSplitter` participants and pair them with the next available one
                    for (i in 0 until matchSplitter - 1 step 2) { // Pair all except the last one
                        val participantI = group[i]
                        val participantJ = group[i + 1]

                        // Ensure both participants have less than 3 matches before scheduling
                        if ((matchCount[participantI.participantId] ?: 0) < 3 && (matchCount[participantJ.participantId] ?: 0) < 3) {
                            val match = MatchWithParticipantsDTO(
                                matchId = matchid,
                                tournamentID = tournament.tournamentId ?: -1,
                                time = Clock.System.now(),
                                gameLocationId = fields[0].fieldId ?: -1,
                                participants = listOf(
                                    MatchParticipantWithParticipantDTO(
                                        matchId = matchid, participant = participantI, index = 1
                                    ),
                                    MatchParticipantWithParticipantDTO(
                                        matchId = matchid, participant = participantJ, index = 2
                                    )
                                )
                            )
                            matchid++
                            matches.add(match)

                            // Increment match count for both participants
                            matchCount[participantI.participantId ?: Int.MAX_VALUE] =
                                (matchCount[participantI.participantId] ?: 0) + 1
                            matchCount[participantJ.participantId ?: Int.MAX_VALUE] =
                                (matchCount[participantJ.participantId] ?: 0) + 1
                        }
                    }

                    // If odd number of participants, last unpaired participant plays against the first
                    val lastParticipant = group[matchSplitter - 1]
                    val firstParticipant = group[0]

                    val match = MatchWithParticipantsDTO(
                        matchId = matchid,
                        tournamentID = tournament.tournamentId ?: -1,
                        time = Clock.System.now(),
                        gameLocationId = fields[0].fieldId ?: -1,
                        participants = listOf(
                            MatchParticipantWithParticipantDTO(
                                matchId = matchid, participant = lastParticipant, index = 1
                            ),
                            MatchParticipantWithParticipantDTO(
                                matchId = matchid, participant = firstParticipant, index = 2
                            )
                        )
                    )
                    matchid++
                    matches.add(match)

                    // Increment match count for both participants
                    matchCount[lastParticipant.participantId ?: Int.MAX_VALUE] =
                        (matchCount[lastParticipant.participantId] ?: 0) + 1
                    matchCount[firstParticipant.participantId ?: Int.MAX_VALUE] =
                        (matchCount[firstParticipant.participantId] ?: 0) + 1
                }
                println("Final Count")
                for (count in matchCount) {
                    println(count)
                }
                println()

            }


        }



        for (match in matches) {
            for (participant in match.participants) {
                println(participant.participant.name)
            }
        }

        return matches;
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
            client.from("match_participant")
                .insert(MatchParticipant(match.matchId, participant.participantId ?: 0, index))
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