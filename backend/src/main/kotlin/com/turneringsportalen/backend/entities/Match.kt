package com.turneringsportalen.backend.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Match(
        @SerialName("match_id") val matchId : Int? = null, // Allow null so it won't be sent,
        @SerialName("tournament_id") val tournamentID : Int,
        val time : Instant,
        @SerialName("game_location_id") val gameLocationId : Int
)
