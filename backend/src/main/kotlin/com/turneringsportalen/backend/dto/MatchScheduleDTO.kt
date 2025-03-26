package com.turneringsportalen.backend.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MatchOverviewDTO(
    @SerialName("match_id") val matchId: Int?,
    val date: String, // Extracted from time
    val time: String, // Extracted from time
    @SerialName("game_location") val gameLocation: GameLocationDTO,
    val participants: List<SimpleParticipantDTO>
)

@Serializable
data class GameLocationDTO(
    @SerialName("game_location_id") val gameLocationId: Int,
    val name: String
)

@Serializable
data class SimpleParticipantDTO(
    @SerialName("participant_id") val participantId: Int?,
    val name: String
)
