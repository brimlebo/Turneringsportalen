package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.CreateParticipantDTO
import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.services.ParticipantService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/participant")
class ParticipantController(private val service: ParticipantService) {

    @GetMapping
    fun findAllParticipants() = runBlocking { service.findAllParticipants() }

    @GetMapping("/{id}")
    fun findParticipantById(@PathVariable id: Int) = runBlocking { service.findParticipantById(id) }

    @PostMapping
    fun addNewParticipant(@RequestBody participantDTO : CreateParticipantDTO) = runBlocking {
        val participant = Participant(
            tournamentId = participantDTO.tournamentId,
            name = participantDTO.name
        )
        service.addParticipant(participant)
    }

    @PutMapping("/{id}")
    fun updateParticipant(@PathVariable id : Int, @RequestBody participant: Participant) = runBlocking{
        service.updateParticipants(participant)
    }

    @DeleteMapping("/{id}")
    fun deleteParticipantById(@PathVariable id: Int) = runBlocking{
        service.deleteParticipant(id)
    }

}
