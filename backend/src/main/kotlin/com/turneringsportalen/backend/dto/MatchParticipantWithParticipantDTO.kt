package com.turneringsportalen.backend.dto

import com.turneringsportalen.backend.entities.Participant
import kotlinx.serialization.SerialName

class MatchParticipantWithParticipantDTO (
    @SerialName("match_id") val matchId: Int? = null, // Allow null so it won't be sent,
    val participant: Participant,
    val index: Int
)
