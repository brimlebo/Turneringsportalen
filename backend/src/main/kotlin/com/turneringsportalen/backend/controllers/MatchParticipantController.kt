package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.MatchParticipantDTO
import com.turneringsportalen.backend.entities.MatchParticipant
import com.turneringsportalen.backend.services.MatchParticipantService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/matchparticipant")
class MatchParticipantController(private val service: MatchParticipantService) {

    @GetMapping("/{id}")
    fun findMatchParticipantsById(@PathVariable id: Int) = runBlocking { service.findMatchParticipantById(id) }

    @GetMapping
    fun findAllMatchParticipants() = runBlocking { service.findAllMatchParticipants()}

    @PostMapping
    fun addMatchParticipant(@RequestBody matchParticipant: MatchParticipant) = runBlocking {
        service.addMatchParticipant(matchParticipant)
    }

    @PutMapping("/{id}")
    fun updateMatchParticipant(@PathVariable id: Int, @RequestBody matchParticipantDTO: MatchParticipantDTO) = runBlocking {
       // service.updateMatchParticipant(id, matchParticipantDTO)
    }

    @DeleteMapping("/{id}")
    fun deleteMatchParticipant(@PathVariable id: Int) = runBlocking { service.deleteMatchParticipant(id) }
}
