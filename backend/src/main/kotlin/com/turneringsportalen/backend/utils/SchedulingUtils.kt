package com.turneringsportalen.backend.utils

import com.turneringsportalen.backend.dto.*
import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.entities.TournamentField
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.time.Duration.Companion.minutes
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

fun createGroups(participants: List<Participant>, minMatches: Int) : List<List<Participant>> {
    val groupSize = minMatches + 1
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

    return groups
}

fun scheduleStandardGroups(group: List<Participant>, minimumMatches: Int, tournament: Tournament, fields: List<TournamentField>) : List<MatchWithParticipantsDTO> {
    // Implementation
    val groupSize = minimumMatches + 1
    var matchid = 0;
    val matches = mutableListOf<MatchWithParticipantsDTO>()

    for (i in group.indices) {
        for (j in i + 1 until groupSize) {
            val match = MatchWithParticipantsDTO(
                matchId = matchid,
                tournamentID = tournament.tournamentId ?: -1,
                time = null,
                gameLocationId = -1,
                participants = listOf(
                    MatchParticipantWithParticipantDTO(
                        matchId = matchid,
                        participant = group[i],
                        index = 1
                    ), MatchParticipantWithParticipantDTO(
                        matchId = matchid,
                        participant = group[j],
                        index = 2
                    )
                )
            )
            matchid++
            matches.add(match)
        }
    }

    return matches
}

// Exception when group has more members than normal group size
fun scheduleExceptionGroups(group: List<Participant>, minimumMatches: Int, groupSize: Int, tournament: Tournament, fields: List<TournamentField>) : List<MatchWithParticipantsDTO> {
    var matches = mutableListOf<MatchWithParticipantsDTO>()

    // Track min matches
    val matchCount = mutableMapOf<Int, Int>()  // Track match count per participant
    // sets each participant on each participantId in the group to 0
    group.forEach { matchCount[it.participantId ?: Int.MAX_VALUE] = 0 }

    if((minimumMatches * 2) == groupSize) {
        // case when there is an even number of participants, and the group can be split in half
        matches = schedule2TimesMinimumMatches(group, minimumMatches, tournament, fields)
    }
    else {
        // case for all other exception groups
        matches = scheduleRemainingExceptionGroups(group, minimumMatches, tournament, fields)
    }


    return matches;
}

private fun schedule2TimesMinimumMatches(group: List<Participant>, minimumMatches: Int, tournament: Tournament, fields: List<TournamentField>) : MutableList<MatchWithParticipantsDTO> {
    val matches = mutableListOf<MatchWithParticipantsDTO>()
    var matchid = 0;

    // Track min matches
    val matchCount = mutableMapOf<Int, Int>()  // Track match count per participant
    // sets each participant on each participantId in the group to 0
    group.forEach { matchCount[it.participantId ?: Int.MAX_VALUE] = 0 }

    for (i in group.indices) {
        val participantI = group[i]

        for (j in minimumMatches until minOf(group.size, minimumMatches * 2)) {
            val participantJ = group[j]

            // Ensure participant J and I has less than 3 matches before continuing
            if ((matchCount[participantJ.participantId]
                    ?: 0) != minimumMatches && (matchCount[participantI.participantId] ?: 0) != minimumMatches
            ) {
                val match = MatchWithParticipantsDTO(
                    matchId = matchid,
                    tournamentID = tournament.tournamentId ?: -1,
                    time = null,
                    gameLocationId = -1,
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
            }
        }
    }
    return matches
}

private fun scheduleRemainingExceptionGroups(group: List<Participant>, minimumMatches: Int, tournament: Tournament, fields: List<TournamentField>) : MutableList<MatchWithParticipantsDTO> {
    val g = group.size
    // Determine if an extra match is needed.
    // (If g * minimumMatches is odd, then one team must get one extra match.)
    val hasExtra = (g * minimumMatches) % 2 != 0

    // Define each team’s target match count.
    // We designate the first participant (index 0) as the extra team if needed.
    val targetMatches = mutableMapOf<Int, Int>()
    for (i in 0 until g) {
        targetMatches[i] = if (hasExtra && i == 0) minimumMatches + 1 else minimumMatches
    }

    // In a full round robin every team plays (g - 1) matches.
    // We want to remove some matches so that each team i ends up playing exactly targetMatches[i].
    // Thus, for each team, the number of removals is:
    //    removalCount[i] = (g - 1) - targetMatches[i]
    val removalCounts = IntArray(g) { i -> (g - 1) - (targetMatches[i] ?: 0) }

    // Define a simple Vertex class to hold an id and its remaining "removal degree"
    data class Vertex(val id: Int, var degree: Int)

    // Build our list of vertices (one per participant)
    val vertices = (0 until g).map { Vertex(it, removalCounts[it]) }.toMutableList()

    // Use a Havel–Hakimi style algorithm to select a set of edges (i.e. match removals)
    // that “use up” the removal degree of each vertex.
    fun buildRemovalEdges(vertices: MutableList<Vertex>): List<Pair<Int, Int>>? {
        val removalEdges = mutableListOf<Pair<Int, Int>>()
        // Iteratively "satisfy" the highest removal demands.
        while (true) {
            // Sort vertices by descending degree.
            vertices.sortByDescending { it.degree }
            if (vertices[0].degree == 0) break // all vertices satisfied
            val u = vertices[0]
            val d = u.degree
            if (d > vertices.size - 1) return null // degree sequence not graphical (should not happen)
            // Connect u with the next d vertices in the sorted order.
            for (i in 1..d) {
                val v = vertices[i]
                if (v.degree <= 0) return null // no valid edge available
                removalEdges.add(Pair(u.id, v.id))
                v.degree -= 1
            }
            u.degree = 0
        }
        return removalEdges
    }

    val removalEdges = buildRemovalEdges(vertices.toMutableList())
        ?: throw IllegalArgumentException("No valid schedule found for given parameters.")

    // For lookup purposes, create a set of edges (with smaller index first)
    val removalEdgeSet = removalEdges.map { (i, j) ->
        if (i < j) Pair(i, j) else Pair(j, i)
    }.toSet()

    // Build the complete round robin: every pair (i, j) with i < j.
    val fullMatches = mutableListOf<Pair<Int, Int>>()
    for (i in 0 until g) {
        for (j in i + 1 until g) {
            fullMatches.add(Pair(i, j))
        }
    }

    // The scheduled matches are those from the full round robin minus the removal edges.
    val scheduledMatches = fullMatches.filter { pair ->
        val ordered = if (pair.first < pair.second) pair else Pair(pair.second, pair.first)
        !removalEdgeSet.contains(ordered)
    }

    // Create MatchWithParticipantsDTO objects for each scheduled match.
    // Here we assign tournament fields in round-robin fashion.
    val matches = mutableListOf<MatchWithParticipantsDTO>()
    var matchId = 0
    var fieldIndex = 0
    for ((i, j) in scheduledMatches) {
        val p1 = group[i]
        val p2 = group[j]
        val field = fields[fieldIndex % fields.size]
        val match = MatchWithParticipantsDTO(
            matchId = matchId,
            tournamentID = tournament.tournamentId ?: -1,
            time = null,
            gameLocationId = -1,
            participants = listOf(
                MatchParticipantWithParticipantDTO(
                    matchId = matchId,
                    participant = p1,
                    index = 1
                ),
                MatchParticipantWithParticipantDTO(
                    matchId = matchId,
                    participant = p2,
                    index = 2
                )
            )
        )
        matches.add(match)
        matchId++
        fieldIndex++
    }

    return matches
}

fun assignMatchTimeAndLocation(
    tournament: Tournament,
    allocatedFields: List<TournamentField>,
    matchesInGroup: MutableList<MatchWithParticipantsDTO>,
    startingTime: Instant,
    group: List<Participant>
): MutableList<MatchWithParticipantsDTO> {
    val simultaneousMatches = minOf(group.size / 2, allocatedFields.size)
    val matchInterval = tournament.matchInterval

    var currentTime = startingTime
    val unscheduledMatches = matchesInGroup.toMutableList()
    val scheduledMatches = mutableListOf<MatchWithParticipantsDTO>()

    // Track which participants have played at each timeslot
    val timeslotParticipantMap = mutableMapOf<Instant, MutableSet<Int>>()

    while (unscheduledMatches.isNotEmpty()) {
        var matchesScheduledThisSlot = 0
        val alreadyScheduledParticipants = timeslotParticipantMap.getOrPut(currentTime) { mutableSetOf() }

        val iterator = unscheduledMatches.iterator()
        val matchesThisSlot = mutableListOf<MatchWithParticipantsDTO>()

        while (iterator.hasNext() && matchesScheduledThisSlot < simultaneousMatches) {
            val match = iterator.next()

            // Get participant IDs for this match
            val participantIds = match.participants.map { it.participant.participantId }

            // Check if any of the participants already have a match at this timeslot
            if (participantIds.any { it in alreadyScheduledParticipants }) continue

            // Assign time and field
            match.time = currentTime
            match.gameLocationId = allocatedFields[matchesScheduledThisSlot].fieldId ?: -1

            // Update tracking
            alreadyScheduledParticipants.addAll(participantIds.filterNotNull())
            matchesThisSlot.add(match)
            iterator.remove()
            matchesScheduledThisSlot++
        }

        scheduledMatches += matchesThisSlot
        currentTime = currentTime.plus(matchInterval.minutes)
    }

    return scheduledMatches
}


private fun addDuration(startingTime: Instant, minutesToAdd: Int): Instant {
    return startingTime.plus(minutesToAdd.minutes)
}

private fun mapMatchToOverview(
    match: MatchWithParticipantsDTO,
    tournamentFields: List<TournamentField>
): MatchOverviewDTO {
    // Find the TournamentField that matches the gameLocationId.
    val field = tournamentFields.firstOrNull { it.fieldId == match.gameLocationId }
    val gameLocationDTO = if (field != null) {
        GameLocationDTO(
            gameLocationId = field.fieldId ?: match.gameLocationId,
            name = field.fieldName
        )
    } else {
        // Fallback in case no matching field is found.
        GameLocationDTO(
            gameLocationId = match.gameLocationId,
            name = "Unknown Field"
        )
    }

    // Convert the Instant to a local date/time.
    val localDateTime = match.time?.toLocalDateTime(TimeZone.currentSystemDefault())
        ?: Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())

    // Format date as dd.MM (day and month)
    val day = localDateTime.date.dayOfMonth
    val month = localDateTime.date.monthNumber
    val dateString = "%02d.%02d".format(day, month)

    // Format time as hh:mm (hour and minute)
    val hour = localDateTime.time.hour
    val minute = localDateTime.time.minute
    val timeString = "%02d:%02d".format(hour, minute)

    // Map each MatchParticipantWithParticipantDTO to a SimpleParticipantDTO,
    // sorted by their index.
    val simpleParticipants = match.participants
        .sortedBy { it.index }
        .map { participantDTO ->
            SimpleParticipantDTO(
                participantId = participantDTO.participant.participantId,
                name = participantDTO.participant.name
            )
        }

    return MatchOverviewDTO(
        matchId = match.matchId,
        date = dateString,
        time = timeString,
        gameLocation = gameLocationDTO,
        participants = simpleParticipants
    )
}



// Mapping a list of matches:
fun mapMatchesToOverviewList(
    matches: List<MatchWithParticipantsDTO>,
    tournamentFields: List<TournamentField>
): List<MatchOverviewDTO> {
    return matches.map { match -> mapMatchToOverview(match, tournamentFields) }
}

