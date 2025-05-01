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

// Types for fetching

@Serializable
data class RawMatchRow(
    @SerialName("match_id") val matchId: Int,
    val time: Instant,
    @SerialName("available_fields") val field: FieldRow,
    @SerialName("match_participant") val matchParticipant: List<ParticipantRow>
)

@Serializable
data class FieldRow(
    @SerialName("field_id") val fieldId: Int,
    @SerialName("field_name") val fieldName: String
)

@Serializable
data class ParticipantRow(
    @SerialName("participant_id") val participantId: Int?,
    val participant: ParticipantNameRow
)

@Serializable
data class ParticipantNameRow(
    val name: String
)
