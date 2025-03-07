package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TournamentField (
    @SerialName("field_id") val fieldId : Int? = null, // Allow null so it won't be sent,
    @SerialName("tournament_id") val tournamentId : Int,
    @SerialName("field_name") val fieldName : String
)