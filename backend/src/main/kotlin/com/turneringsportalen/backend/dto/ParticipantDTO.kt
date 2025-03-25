package com.turneringsportalen.backend.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ParticipantDTO(
    @SerialName("participant_id") val participantId: Int,
    @SerialName("tournament_id") val tournamentId: Int,
    val name: String
)
