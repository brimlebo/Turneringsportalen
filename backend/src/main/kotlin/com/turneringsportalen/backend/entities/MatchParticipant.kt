package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MatchParticipant(
    @SerialName("match_id") val matchId: Int? = null, // Allow null so it won't be sent,
    @SerialName("participant_id") val participantId: Int,
    val index: Int
)
