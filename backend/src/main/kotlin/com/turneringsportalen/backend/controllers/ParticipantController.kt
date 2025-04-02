package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.dto.CreateParticipantDTO
import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.services.ParticipantService
import kotlinx.coroutines.runBlocking
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/participant")
class ParticipantController(private val service: ParticipantService) {

    @GetMapping
    fun findAllParticipants() = runBlocking { service.findAllParticipants() }

    @GetMapping("/{id}")
    fun findParticipantById(@PathVariable id: Int) = runBlocking { service.findParticipantById(id) }

    @PostMapping // Change the parameter type here
    fun addNewParticipant(@RequestBody participantDTO : CreateParticipantDTO): ResponseEntity<Void> = runBlocking { // Return ResponseEntity
        // Map from the CreateParticipantDTO to the Participant entity
        val participant = Participant(
            // participantId will be null here, letting the database generate it
            tournamentId = participantDTO.tournamentId,
            name = participantDTO.name
        )
        service.addParticipant(participant)
        // Return 201 Created status code
        ResponseEntity(HttpStatus.CREATED)
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
