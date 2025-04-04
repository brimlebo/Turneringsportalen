package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.CreateTournamentDTO
import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.entities.TournamentField
import com.turneringsportalen.backend.services.TournamentFieldService
import com.turneringsportalen.backend.services.TournamentService
import com.turneringsportalen.backend.utils.validateTournamentToBeCreated
import kotlinx.coroutines.runBlocking
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tournaments")
class TournamentController(private val service: TournamentService, private val fieldService: TournamentFieldService) {

    @GetMapping
    fun findAllTournaments() = runBlocking { service.findAllTournaments() }

    @GetMapping("/{id}")
    fun findTournamentById(@PathVariable id: Int) = runBlocking {
        try {
            val tournament = service.findTournamentWithSchedule(id)
            ResponseEntity(tournament, HttpStatus.OK)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @PostMapping
    fun addNewTournament(@RequestBody tournamentDTO: CreateTournamentDTO) = runBlocking {
        try {
            validateTournamentToBeCreated(tournamentDTO)
            var tournament = Tournament(
                name = tournamentDTO.name,
                startDate = tournamentDTO.startDate,
                location = tournamentDTO.location,
                matchInterval = tournamentDTO.matchInterval,
                minimumMatches = tournamentDTO.minimumMatches
            )
            tournament = service.createTournament(tournament)
            for (fieldName in tournamentDTO.fieldNames) {
                val field = TournamentField(
                    tournamentId = tournament.tournamentId!!,
                    fieldName = fieldName
                )
                fieldService.addTournamentField(field)
            }

            ResponseEntity(HttpStatus.CREATED)
        } catch (ex: Exception) {
            ResponseEntity(ex.message, HttpStatus.BAD_REQUEST)
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

    @GetMapping("/{id}/matches")
    fun findMatchesByTournamentId(@PathVariable id: Int) = runBlocking { service.findMatchesByTournamentId(id) }

    @GetMapping("/{id}/allParticipants")
    fun findParticipantsByTournamentId(@PathVariable id: Int) = runBlocking { service.findAllTournamentParticipants(id) }

    @GetMapping("/{id}/fields")
    fun findFieldsByTournamentId(@PathVariable id: Int) = runBlocking { service.findFieldsByTournamentId(id) }

    // Trigger the scheduling algorithm for a tournament
    @PostMapping("/{id}/schedule")
    fun createTournamentSchedule(@PathVariable id: Int) = runBlocking {
        service.setUpMatches(id)
    }
}
