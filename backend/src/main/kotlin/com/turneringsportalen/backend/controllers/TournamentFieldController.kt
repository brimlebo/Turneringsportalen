package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.entities.TournamentField
import com.turneringsportalen.backend.services.TournamentFieldService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/available_fields")
@CrossOrigin(origins = ["http://localhost:3000"], maxAge = 3600) // Restrict to frontend
class TournamentFieldController(private val service: TournamentFieldService) {

    @GetMapping
    fun findAllTournamentFields() = runBlocking { service.findAllTournamentFields() }

    @GetMapping("/{id}")
    fun findTournamentFieldById(@PathVariable id: Int) = runBlocking { service.findTournamentFieldById(id) }

    @PostMapping
    fun addTournamentField(@RequestBody tournamentField: TournamentField) = runBlocking {
        service.addTournamentField(tournamentField)
    }

    @PutMapping("/{id}")
    fun updateTournamentField(@PathVariable id: Int, @RequestBody tournamentField: TournamentField) = runBlocking {
        service.updateTournamentField(tournamentField)
    }

    @DeleteMapping("/{id}")
    fun deleteTournamentField(@PathVariable id: Int) = runBlocking { service.deleteTournamentField(id) }
}
