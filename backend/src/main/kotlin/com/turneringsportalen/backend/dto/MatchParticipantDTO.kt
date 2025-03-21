package com.turneringsportalen.backend.dto

data class MatchParticipantDTO(
    val matchId: Int,
    val participantId: Int,
    val index: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MatchParticipantDTO

        if (matchId != other.matchId) return false
        if (participantId != other.participantId) return false
        if (index != other.index) return false

        return true
    }

    override fun hashCode(): Int {
        var result = matchId
        result = 31 * result + participantId
        result = 31 * result + index
        return result
    }

    override fun toString(): String {
        return "MatchParticipantDTO(matchId=$matchId, participantId=$participantId, index=$index)"
    }
}
