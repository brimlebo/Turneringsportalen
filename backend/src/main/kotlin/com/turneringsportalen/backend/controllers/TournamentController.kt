package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.CreateTournamentDTO
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

    // May have to return a ResponseEntity here => ResponseEntity(service.findAllTournaments(), HttpStatus.OK)
    @GetMapping
    fun findAllTournaments() = runBlocking { service.findAllTournaments() }

    @GetMapping("/{id}")
    fun findTournamentById(@PathVariable id: Int) = runBlocking { service.findTournamentById(id) }

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


    // Get data from other tables for a specific tournament
    @GetMapping("/{matchId}/participants")
    fun findMatchParticipantsByMatchId(@PathVariable matchId: Int) = runBlocking {
        service.findMatchParticipantsByMatchId(matchId)
    }

    @GetMapping("/{id}/matches")
    fun findMatchesByTournamentId(@PathVariable id: Int) = runBlocking {
        service.findMatchesByTournamentId(id)
    }

    @GetMapping("/{id}/participants")
    fun findParticipantsByTournamentId(@PathVariable id: Int) = runBlocking{
        service.findAllTournamentParticipants(id)
    }

    @GetMapping("/{id}/fields")
    fun findFieldsByTournamentId(@PathVariable id: Int) = runBlocking {
        service.findFieldsByTournamentId(id)
    }
}
