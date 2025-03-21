package com.turneringsportalen.backend.dto

import com.turneringsportalen.backend.entities.MatchParticipant
import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName

class MatchWithParticipantsDTO (
    @SerialName("match_id") val matchId : Int? = null, // Allow null so it won't be sent,
    @SerialName("tournament_id") val tournamentID : Int,
    var time : Instant? = null,
    @SerialName("game_location_id") var gameLocationId : Int,
    val participants: List<MatchParticipantWithParticipantDTO>
) {
    override fun toString(): String {
        return "MatchWithParticipantsDTO(matchId=$matchId, tournamentID=$tournamentID, time=$time, gameLocationId=$gameLocationId, $participants)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MatchWithParticipantsDTO

        if (matchId != other.matchId) return false
        if (tournamentID != other.tournamentID) return false
        if (time != other.time) return false
        if (gameLocationId != other.gameLocationId) return false
        if (participants != other.participants) return false

        return true
    }

    override fun hashCode(): Int {
        var result = matchId ?: 0
        result = 31 * result + tournamentID
        result = 31 * result + (time?.hashCode() ?: 0)
        result = 31 * result + gameLocationId
        result = 31 * result + participants.hashCode()
        return result
    }
}