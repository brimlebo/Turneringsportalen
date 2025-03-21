package com.turneringsportalen.backend.utils

import com.turneringsportalen.backend.dto.MatchWithParticipantsDTO
import com.turneringsportalen.backend.entities.Match
import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.entities.TournamentField
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import java.time.Duration
import kotlin.test.*
import kotlin.time.Duration.Companion.minutes

class SchedulingUtilsTest {

    private val tournament: Tournament = Tournament(1, "Test Tournament", Clock.System.now(), "Test Location", 30)
    private val tournamentId = tournament.tournamentId ?: 0 // Ensures all participants use the actual tournament ID

    private val potentialParticipants = listOf(
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
        Participant(11, tournamentId, "Nordnes svart"),
        Participant(12, tournamentId, "Baune svart"),
        Participant(13, tournamentId, "Nymark svart"),
        Participant(14, tournamentId, "Nymark hvit"),
        Participant(15, tournamentId, "Nymark rød"),
        Participant(16, tournamentId, "Nymark grå"),
        Participant(17, tournamentId, "Gneist hvit"),
        Participant(18, tournamentId, "Gneist blå"),
        Participant(19, tournamentId, "Gneist rød"),
        Participant(20, tournamentId, "Brann hvit"),
        Participant(21, tournamentId, "Brann rød"),
        Participant(22, tournamentId, "Brann svart"),
    )

    private val potentialFields = listOf(
        TournamentField(1, tournamentId, "Field A"),
        TournamentField(2, tournamentId, "Field B"),
        TournamentField(3, tournamentId, "Field C"),
        TournamentField(4, tournamentId, "Field D")
    )

    @Test
    fun testGeneratingTwoGroupsOfFour() {
        // Get the first 8 participants
        val participants = potentialParticipants.take(8)
        val minMatches = 3

        // Generate groups
        val groups = createGroups(participants, minMatches);

        // Ensure two groups was created
        assertEquals(2, groups.size, "Should have exactly 2 groups")

        // Ensure that both groups have 4 participants
        for (group in groups) {
            assertEquals(4, group.size, "Each group should have exactly 4 participants")
        }
    }

    @Test
    fun testGeneratingOneGroupOfFourAndOneGroupOfFive() {
        // Get the first 9 participants
        val participants = potentialParticipants.take(9)
        val minMatches = 3

        // Generate groups
        val groups = createGroups(participants, minMatches)

        // Ensure two groups was created
        assertEquals(2, groups.size, "Should have exactly 2 groups")

        // Ensure the first group has 4 participants
        assertEquals(4, groups[0].size, "The first group should have exactly 4 participants")

        // Ensure the second group has 5 participants
        assertEquals(5, groups[1].size, "The second group should have exactly 5 participants")
    }


    @Test
    fun testGeneratingTwoGroupsOfFourAndOneGroupOfSeven() {
        // Get the first 15 participants
        val participants = potentialParticipants.take(15)
        val minMatches = 3

        // Generate groups
        val groups = createGroups(participants, minMatches);

        // Ensure three groups was created
        assertEquals(3, groups.size, "Should have exactly 3 groups")

        // Ensure the first two groups have 4 participants
        assertEquals(4, groups[0].size, "The first group should have exactly 4 participants")
        assertEquals(4, groups[1].size, "The second group should have exactly 4 participants")

        // Ensure the final group has 7 participants
        assertEquals(7, groups[2].size, "The third group should have exactly 7 participants")
    }

    @Test
    fun testGeneratingGroupsOfFive() {
        val participants = potentialParticipants
        val minMatches = 4

        // Generate groups
        val groups = createGroups(participants, minMatches);

        // Ensure four groups was created
        assertEquals(4, groups.size, "Should have exactly 4 groups")

        // Ensure the first three groups have 5 participants
        assertEquals(5, groups[0].size, "The first group should have exactly 5 participants")
        assertEquals(5, groups[1].size, "The second group should have exactly 5 participants")
        assertEquals(5, groups[2].size, "The third group should have exactly 5 participants")

        // Ensure the final group has 7 participants
        assertEquals(7, groups[3].size, "The fourth group should have exactly 7 participants")
    }

    @Test
    fun testGeneratingGroupsOfSeven() {
        val participants = potentialParticipants
        val minMatches = 6

        // Generate groups
        val groups = createGroups(participants, minMatches);

        // Ensure three groups was created
        assertEquals(3, groups.size, "Should have exactly 3 groups")

        // Ensure the first two groups have 7 participants
        assertEquals(7, groups[0].size, "The first group should have exactly 7 participants")
        assertEquals(7, groups[1].size, "The second group should have exactly 7 participants")

        // Ensure the last group have 8 participants
        assertEquals(8, groups[2].size, "The third group should have exactly 8 participants")
    }

    @Test
    fun testScheduleStandardGroupWith3MinimumMatches() {
        val group = potentialParticipants.take(4)
        val minimumMatches = 3

        val matches = scheduleStandardGroups(group, minimumMatches, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 3 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(3, count, "Participant ${participant.participantId} should have exactly 3 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleStandardGroupWith4MinimumMatches() {
        val group = potentialParticipants.take(5)
        val minimumMatches = 4

        val matches = scheduleStandardGroups(group, minimumMatches, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 3 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(4, count, "Participant ${participant.participantId} should have exactly 4 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleStandardGroupWith7MinimumMatches() {
        val group = potentialParticipants.take(8)
        val minimumMatches = 7

        val matches = scheduleStandardGroups(group, minimumMatches, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 3 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(7, count, "Participant ${participant.participantId} should have exactly 7 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith3MinimumMatchesAnd5GroupSize() {
        val group = potentialParticipants.take(5)
        val minimumMatches = 3

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure one participant has exactly 4 matches while the rest have 3
        var foundFourMatches = false

        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0

            if (count == 4) {
                assertFalse(foundFourMatches, "More than one participant has 4 matches!")
                foundFourMatches = true
            } else {
                assertEquals(3, count, "Participant ${participant.participantId} should have exactly 3 matches")
            }
        }

        // Ensure a team played 4 matches
        assertTrue(foundFourMatches)

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith3MinimumMatchesAnd6GroupSize() {
        val group = potentialParticipants.take(6)
        val minimumMatches = 3

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 3 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(3, count, "Participant ${participant.participantId} should have exactly 3 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith3MinimumMatchesAnd7GroupSize() {
        val group = potentialParticipants.take(7)
        val minimumMatches = 3

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure one participant has exactly 4 matches while the rest have 3
        var foundFourMatches = false

        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0

            if (count == 4) {
                assertFalse(foundFourMatches, "More than one participant has 4 matches!")
                foundFourMatches = true
            } else {
                assertEquals(3, count, "Participant ${participant.participantId} should have exactly 3 matches")
            }
        }

        // Ensure a team played 4 matches
        assertTrue(foundFourMatches)

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith4MinimumMatchesAnd6GroupSize() {
        val group = potentialParticipants.take(6)
        val minimumMatches = 4

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 4 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(4, count, "Participant ${participant.participantId} should have exactly 4 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith4MinimumMatchesAnd7GroupSize() {
        val group = potentialParticipants.take(7)
        val minimumMatches = 4

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 4 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(4, count, "Participant ${participant.participantId} should have exactly 4 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith4MinimumMatchesAnd8GroupSize() {
        val group = potentialParticipants.take(8)
        val minimumMatches = 4

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 4 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(4, count, "Participant ${participant.participantId} should have exactly 4 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd8GroupSize() {
        val group = potentialParticipants.take(8)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd9GroupSize() {
        val group = potentialParticipants.take(9)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd10GroupSize() {
        val group = potentialParticipants.take(10)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd11GroupSize() {
        val group = potentialParticipants.take(11)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd12GroupSize() {
        val group = potentialParticipants.take(12)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith6MinimumMatchesAnd13GroupSize() {
        val group = potentialParticipants.take(13)
        val minimumMatches = 6

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 6 matches
        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0
            assertEquals(6, count, "Participant ${participant.participantId} should have exactly 6 matches")
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith9MinimumMatchesAnd13GroupSize() {
        val group = potentialParticipants.take(13)
        val minimumMatches = 9

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure one participant has exactly 10 matches while the rest have 9
        var foundTenMatches = false

        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0

            if (count == 10) {
                assertFalse(foundTenMatches, "More than one participant has 10 matches!")
                foundTenMatches = true
            } else {
                assertEquals(9, count, "Participant ${participant.participantId} should have exactly 9 matches")
            }
        }

        // Ensure a team played 10 matches
        assertTrue(foundTenMatches)

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testScheduleExceptionGroupWith13MinimumMatchesAnd15GroupSize() {
        val group = potentialParticipants.take(15)
        val minimumMatches = 13

        val matches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure one participant has exactly 14 matches while the rest have 13
        var foundThirteenMatches = false

        for (participant in group) {
            val count = matchCounts[participant.participantId] ?: 0

            if (count == 14) {
                assertFalse(foundThirteenMatches, "More than one participant has 14 matches!")
                foundThirteenMatches = true
            } else {
                assertEquals(13, count, "Participant ${participant.participantId} should have exactly 13 matches")
            }
        }

        // Ensure a team played 13 matches
        assertTrue(foundThirteenMatches)

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testCreateGroupsAndMatches() {
        val participants = potentialParticipants
        val minimumMatches = 3
        val standardGroupSize = 4

        val groups = createGroups(participants, minimumMatches);

        // Ensure we have 5 groups
        assertEquals(5, groups.size)

        //Ensure last group is the exception group
        assertEquals(6, groups[groups.size-1].size)

        val matches = mutableListOf<MatchWithParticipantsDTO>();

        for(group in groups) {
            if(group.size == standardGroupSize) {
                matches += scheduleStandardGroups(group, minimumMatches, tournament, potentialFields)
            }
            else {
                matches += scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields)
            }
        }

        // Check that 33 matches where generated
        assertEquals(33, matches.size)

        // Count matches per participant
        val matchCounts = mutableMapOf<Int, Int>() // Maps participant ID to the number of matches played
        for (match in matches) {
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Assert that each participant has played exactly 3 matches
        for(group in groups) {
            for (participant in group) {
                val count = matchCounts[participant.participantId] ?: 0
                assertEquals(3, count, "Participant ${participant.participantId} should have exactly 3 matches")
            }
        }

        val playedMatches = mutableSetOf<Pair<Int, Int>>() // Stores unique matchups

        for (match in matches) {
            val participantIds = match.participants.map { it.participant.participantId ?: 0 }

            // Ensure each match has exactly two participants
            assertEquals(2, participantIds.size, "Each match should have exactly two participants")

            val (id1, id2) = participantIds.sorted() // Normalize order
            val matchPair = id1 to id2

            // Check if the match pair already exists
            assertFalse(playedMatches.contains(matchPair), "Duplicate match found between $id1 and $id2")

            // Add match pair to the set
            playedMatches.add(matchPair)

            // Update match counts
            for (participant in match.participants) {
                matchCounts[participant.participant.participantId ?: 0] =
                    matchCounts.getOrDefault(participant.participant.participantId, 0) + 1
            }
        }

        // Ensure playedMatches is same size as matches
        assertEquals(playedMatches.size, matches.size, "Set of pairings is same size as original match list")
    }

    @Test
    fun testAssigningTimeAndFieldToMatches() {
        val participants = potentialParticipants
        val minimumMatches = 3
        val standardGroupSize = 4
        val matchInterval = tournament.matchInterval

        val groups = createGroups(participants, minimumMatches)

        // Keeping the group structure
        val matches = mutableListOf<MutableList<MatchWithParticipantsDTO>>()
        for ((index, group) in groups.withIndex()) {
            // Schedule the matches for the current group.
            var groupMatches = mutableListOf<MatchWithParticipantsDTO>()
            if (group.size == standardGroupSize) {
                groupMatches = scheduleStandardGroups(group, minimumMatches, tournament, potentialFields).toMutableList()
            } else {
                groupMatches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields).toMutableList()
            }
            // Add the scheduled matches at the corresponding index in matches.
            matches.add(index, groupMatches)
        }

        val finalMatches = mutableListOf<MatchWithParticipantsDTO>()
        var startingTime = tournament.startDate

        // Pair up the groups: for each pair, assign different fields.
        for (i in matches.indices step 2) {
            if (i + 1 < matches.size) {
                // For the paired groups:
                // The group at index i gets fields[0] and fields[1]
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(potentialFields[0], potentialFields[1]),
                    matches[i],
                    startingTime,
                    groups[i]
                )
                // The group at index i+1 gets fields[2] and fields[3]
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(potentialFields[2], potentialFields[3]),
                    matches[i + 1],
                    startingTime,
                    groups[i + 1]
                )
            } else {
                // For the unpaired group, use all potentialFields.
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    potentialFields,
                    matches[i],
                    startingTime,
                    groups[i]
                )
            }
            // Increase the starting time for the next round by 90 minutes.
            startingTime = startingTime.plus((matchInterval * 3).minutes)
        }

        // Check that both a time and a field has been set
        for(match in finalMatches) {
            // Check that a time has been set
            assertNotNull(match.time)

            // Check that a field has been set
            assertFalse { match.gameLocationId == -1 }
        }

        val matchesGroupedByStartTime = finalMatches.groupBy { it.time }.values.map { it.toList() }


        // Check that the number of matches with the same starttime is not higher than number of fields
        for(timeslot in matchesGroupedByStartTime) {
            assertTrue(
                potentialFields.size >= timeslot.size,
                "There are more matches played at a timeslot than there are available fields"
            )
        }

        // Check that a team is not playing two matches at the same time
        val teamTimeMap = mutableMapOf<Instant, MutableSet<Int>>()

        for (match in finalMatches) {
            val time = match.time!!
            val participantsFinal = match.participants

            val participantsAtThisTime = teamTimeMap.getOrPut(time) { mutableSetOf() }

            for (participant in participantsFinal) {
                val participantId = participant.participant.participantId ?: -1
                assertTrue(
                    participantsAtThisTime.add(participantId),
                    "Participant with ID $participantId is scheduled for more than one match at $time"
                )
            }
        }

        // Check that there are not two matches played on the same field at the same time
        val fieldTimePairs = mutableSetOf<Pair<Instant, Int>>()
        for (match in finalMatches) {
            val key = Pair(match.time!!, match.gameLocationId)
            assertTrue(
                fieldTimePairs.add(key),
                "Duplicate match scheduled at same time ${key.first} and field ${key.second}"
            )
        }

        // Check that no match will start on the same field within the matchInterval of another
        val fieldTimeListMap = mutableMapOf<Int, MutableList<Instant>>()

        for (match in finalMatches) {
            val fieldId = match.gameLocationId
            val matchTime = match.time!!

            val timesOnField = fieldTimeListMap.getOrPut(fieldId) { mutableListOf() }

            for (scheduledTime in timesOnField) {
                val diff = kotlin.math.abs(matchTime.minus(scheduledTime).inWholeMinutes)
                assertTrue(
                    diff >= matchInterval,
                    "Two matches scheduled too close together on field $fieldId: $scheduledTime and $matchTime"
                )
            }

            timesOnField.add(matchTime)
        }

        // Check that all the matches have been scheduled
        assertEquals(33, finalMatches.size)
    }

    @Test
    fun testAssigningTimeAndFieldToMatchesOneOddGroup() {
        val participants = potentialParticipants.take(21)
        val minimumMatches = 3
        val standardGroupSize = 4
        val matchInterval = tournament.matchInterval

        val groups = createGroups(participants, minimumMatches)

        // Keeping the group structure
        val matches = mutableListOf<MutableList<MatchWithParticipantsDTO>>()
        for ((index, group) in groups.withIndex()) {
            // Schedule the matches for the current group.
            var groupMatches = mutableListOf<MatchWithParticipantsDTO>()
            if (group.size == standardGroupSize) {
                groupMatches = scheduleStandardGroups(group, minimumMatches, tournament, potentialFields).toMutableList()
            } else {
                groupMatches = scheduleExceptionGroups(group, minimumMatches, group.size, tournament, potentialFields).toMutableList()
            }
            // Add the scheduled matches at the corresponding index in matches.
            matches.add(index, groupMatches)
        }

        val finalMatches = mutableListOf<MatchWithParticipantsDTO>()
        var startingTime = tournament.startDate

        // Pair up the groups: for each pair, assign different fields.
        for (i in matches.indices step 2) {
            if (i + 1 < matches.size) {
                // For the paired groups:
                // The group at index i gets fields[0] and fields[1]
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(potentialFields[0], potentialFields[1]),
                    matches[i],
                    startingTime,
                    groups[i]
                )
                // The group at index i+1 gets fields[2] and fields[3]
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    listOf(potentialFields[2], potentialFields[3]),
                    matches[i + 1],
                    startingTime,
                    groups[i + 1]
                )
            } else {
                // For the unpaired group, use all potentialFields.
                finalMatches += assignMatchTimeAndLocation(
                    tournament,
                    potentialFields,
                    matches[i],
                    startingTime,
                    groups[i]
                )
            }
            // Increase the starting time for the next round by 90 minutes.
            startingTime = startingTime.plus((matchInterval * 3).minutes)
        }

        // Check that both a time and a field has been set
        for(match in finalMatches) {
            // Check that a time has been set
            assertNotNull(match.time)

            // Check that a field has been set
            assertFalse { match.gameLocationId == -1 }
        }

        val matchesGroupedByStartTime = finalMatches.groupBy { it.time }.values.map { it.toList() }


        // Check that the number of matches with the same starttime is not higher than number of fields
        for(timeslot in matchesGroupedByStartTime) {
            assertTrue(
                potentialFields.size >= timeslot.size,
                "There are more matches played at a timeslot than there are available fields"
            )
        }

        // Check that a team is not playing two matches at the same time
        val teamTimeMap = mutableMapOf<Instant, MutableSet<Int>>()

        for (match in finalMatches) {
            val time = match.time!!
            val participantsFinal = match.participants

            val participantsAtThisTime = teamTimeMap.getOrPut(time) { mutableSetOf() }

            for (participant in participantsFinal) {
                val participantId = participant.participant.participantId ?: -1
                assertTrue(
                    participantsAtThisTime.add(participantId),
                    "Participant with ID $participantId is scheduled for more than one match at $time"
                )
            }
        }

        // Check that there are not two matches played on the same field at the same time
        val fieldTimePairs = mutableSetOf<Pair<Instant, Int>>()
        for (match in finalMatches) {
            val key = Pair(match.time!!, match.gameLocationId)
            assertTrue(
                fieldTimePairs.add(key),
                "Duplicate match scheduled at same time ${key.first} and field ${key.second}"
            )
        }

        // Check that no match will start on the same field within the matchInterval of another
        val fieldTimeListMap = mutableMapOf<Int, MutableList<Instant>>()

        for (match in finalMatches) {
            val fieldId = match.gameLocationId
            val matchTime = match.time!!

            val timesOnField = fieldTimeListMap.getOrPut(fieldId) { mutableListOf() }

            for (scheduledTime in timesOnField) {
                val diff = kotlin.math.abs(matchTime.minus(scheduledTime).inWholeMinutes)
                assertTrue(
                    diff >= matchInterval,
                    "Two matches scheduled too close together on field $fieldId: $scheduledTime and $matchTime"
                )
            }

            timesOnField.add(matchTime)
        }

        // Check that all the matches have been scheduled
        assertEquals(32, finalMatches.size)
    }
}

