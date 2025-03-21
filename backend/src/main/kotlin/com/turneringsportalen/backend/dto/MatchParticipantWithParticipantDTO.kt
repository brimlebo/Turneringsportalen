package com.turneringsportalen.backend.dto

import com.turneringsportalen.backend.entities.Participant
import kotlinx.serialization.SerialName

class MatchParticipantWithParticipantDTO (
    @SerialName("match_id") val matchId: Int? = null, // Allow null so it won't be sent,
    val participant: Participant,
    val index: Int
) {
    override fun toString(): String {
        return "MatchParticipantWithParticipantDTO(matchId=$matchId, participant=$participant, index=$index)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MatchParticipantWithParticipantDTO

        if (matchId != other.matchId) return false
        if (participant != other.participant) return false
        if (index != other.index) return false

        return true
    }

    override fun hashCode(): Int {
        var result = matchId ?: 0
        result = 31 * result + participant.hashCode()
        result = 31 * result + index
        return result
    }
}