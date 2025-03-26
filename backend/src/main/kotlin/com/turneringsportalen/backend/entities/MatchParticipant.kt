package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MatchParticipant(
    @SerialName("match_id") val matchId: Int? = null, // Allow null so it won't be sent,
    @SerialName("participant_id") val participantId: Int,
    val index: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MatchParticipant

        if (matchId != other.matchId) return false
        if (participantId != other.participantId) return false
        if (index != other.index) return false

        return true
    }

    override fun hashCode(): Int {
        var result = matchId ?: 0
        result = 31 * result + participantId
        result = 31 * result + index
        return result
    }

    override fun toString(): String {
        return "MatchParticipant(matchId=$matchId, participantId=$participantId, index=$index)"
    }
}
