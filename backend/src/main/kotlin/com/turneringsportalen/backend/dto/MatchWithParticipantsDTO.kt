package com.turneringsportalen.backend.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName

class MatchWithParticipantsDTO (
    @SerialName("match_id") val matchId : Int? = null, // Allow null so it won't be sent,
    @SerialName("tournament_id") val tournamentID : Int,
    val time : Instant,
    @SerialName("game_location_id") val gameLocationId : Int,
    val participants: List<MatchParticipantWithParticipantDTO>
)
