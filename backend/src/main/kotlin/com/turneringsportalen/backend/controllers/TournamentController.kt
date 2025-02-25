package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.services.TournamentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tournaments")
class TournamentController(private val service: TournamentService) {

    @GetMapping("/")
    fun findAllTournaments() = service.findAllTournaments()

    @GetMapping("/{id}")
    fun findTournamentById(@RequestParam id:Int) = service.findById(id)

    @PostMapping("/")
    fun addNewTournament(@RequestBody tournament: Tournament) = service.save(tournament)

    @PutMapping("/{id}")
    fun updateTournament(@RequestParam id:Int, @RequestBody tournament: Tournament) = service.update(tournament)

    @DeleteMapping("/{id}")
    fun deleteTournament(@RequestParam id:Int) = service.delete(id)

}