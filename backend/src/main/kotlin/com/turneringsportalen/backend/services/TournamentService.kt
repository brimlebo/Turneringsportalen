package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.Tournament
import org.springframework.stereotype.Service
import io.github.jan.supabase.SupabaseClient
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant

@Service
class TournamentService (private val client: SupabaseClient) {
    // Currently empty, add methods about tournaments that interact with the database here

    private val tournaments: MutableList<Tournament> = mutableListOf(
        Tournament(1, "Name 1", Clock.System.now(), Clock.System.now(), "Location 1", listOf("Bane 1", "Bane 2", "Bane 3", "Bane 4"), "10:00"),
        Tournament(2, "Name 2", Clock.System.now(), Clock.System.now(), "Location 1", listOf("Bane 1", "Bane 2", "Bane 3", "Bane 4"), "30:00"),
        Tournament(3, "Name 3", Clock.System.now(), Clock.System.now(), "Location 3", listOf("Bane 1", "Bane 2", "Bane 3", ), "20:00"),
    )

    fun findAllTournaments(): List<Tournament>? {
        return tournaments.toList()
    }

    fun findById(id: Int): Tournament? {
        return tournaments.find { it.tournamentId == id }
    }

    fun save(tournament: Tournament): Tournament {
        tournaments.add(tournament)
        return tournament
    }

    fun delete(id: Int): Boolean {
        return tournaments.removeIf { it.tournamentId == id }
    }

    fun update(tournament: Tournament): Tournament? {
        delete(tournament.tournamentId)
        return save(tournament)
    }
}