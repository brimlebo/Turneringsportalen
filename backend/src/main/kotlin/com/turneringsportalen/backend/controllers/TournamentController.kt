package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.daos.CreateTournamentDTO
import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.entities.TournamentField
import com.turneringsportalen.backend.services.TournamentFieldService
import com.turneringsportalen.backend.services.TournamentService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tournaments")
@CrossOrigin(origins = ["http://localhost:3000"], maxAge = 3600) // Restrict to frontend
class TournamentController(private val service: TournamentService, private val fieldService: TournamentFieldService) {

    @GetMapping
    fun findAllTournaments() = runBlocking { service.findAllTournaments() }

    @GetMapping("/{id}")
    fun findTournamentById(@PathVariable id: Int) = runBlocking { service.findById(id) }

    @PostMapping
    fun addNewTournament(@RequestBody tournamentDTO: CreateTournamentDTO) = runBlocking {
        var tournament = Tournament(
            name = tournamentDTO.name,
            startDate = tournamentDTO.startDate,
            location = tournamentDTO.location,
            matchInterval = tournamentDTO.matchInterval
        )
        tournament = service.createTournament(tournament)
        for (fieldName in tournamentDTO.fieldNames) {
            val field = TournamentField(
                tournamentId = tournament.tournamentId!!,
                fieldName = fieldName
            )
            fieldService.addTournamentField(field)
        }
    }

    @PutMapping("/{id}")
    fun updateTournament(@PathVariable id: Int, @RequestBody tournament: Tournament) = runBlocking {
        service.update(
            id,
            tournament.name,
            tournament.startDate,
            tournament.location,
            tournament.matchInterval
        )
    }

    @DeleteMapping("/{id}")
    fun deleteTournament(@PathVariable id: Int) = runBlocking { service.deleteTournament(id) }
}
