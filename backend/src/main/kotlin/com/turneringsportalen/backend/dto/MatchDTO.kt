package com.turneringsportalen.backend.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MatchDTO(
   @SerialName("match_id") val matchId : Int,
   @SerialName("tournament_id") val tournamentId : Int,
   val time : Instant,
   @SerialName("game_location_id") val gameLocationId: Int
)
