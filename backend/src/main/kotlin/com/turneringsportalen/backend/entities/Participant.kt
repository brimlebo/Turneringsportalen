package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Participant(
        @SerialName("participant_id") val participantId: Int? = null, // Allow null so it won't be sent,
        @SerialName("tournament_id") val tournamentId: Int,
        val name: String
)