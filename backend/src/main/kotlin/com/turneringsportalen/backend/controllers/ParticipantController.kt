package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.ParticipantDTO
import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.services.ParticipantService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/participant")
@CrossOrigin(origins = ["http://localhost:3000"], maxAge = 3600)
class ParticipantController(private val service: ParticipantService) {

    @GetMapping()
    fun findAllParticipants() = runBlocking { service.findAllParticipants() }

    @GetMapping("/{id}")
    fun findParticipantById(@PathVariable id: Int) = runBlocking { service.findMatchParticipantById(id) }

    @PostMapping
    fun addNewParticipant(@RequestBody participantDTO : ParticipantDTO) = runBlocking {
        val participant = Participant(
            participantId = participantDTO.participantId,
            tournamentId = participantDTO.tournamentId,
            name = participantDTO.name
        )
        service.addMatchParticipant(participant)
    }






}