package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.MatchDTO
import com.turneringsportalen.backend.entities.Match
import com.turneringsportalen.backend.services.MatchService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/match")
@CrossOrigin(origins = ["http://localhost:3000"], maxAge = 3600)
class MatchController(private val service: MatchService){

    @GetMapping()
    fun findAllMatches() = runBlocking { service.findAllMatches() }

    @GetMapping("/{id}")
    fun findMatchById(@PathVariable id: Int) = runBlocking { service.findById(id) }

    @PostMapping
    fun addNewMatch(@RequestBody matchDTO: MatchDTO) = runBlocking {
        val match = Match(
            matchId = matchDTO.matchId,
            tournamentId = matchDTO.tournamentId,
            time = matchDTO.time,
            gameLocationId = matchDTO.gameLocationId
        )
        service.createMatch(match)
    }

    @PutMapping("/{id}")
    fun updateMatch(@PathVariable id: Int, @RequestBody match: Match) = runBlocking{
        service.update(
            id,
            match.tournamentId,
            match.time,
            match.gameLocationId
        )
    }

    @DeleteMapping("/{id}")
    fun deleteMatch(@PathVariable id: Int) = runBlocking { service.deleteMatch(id) }
}
