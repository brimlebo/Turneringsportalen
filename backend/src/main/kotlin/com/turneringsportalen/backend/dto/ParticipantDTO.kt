package com.turneringsportalen.backend.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ParticipantDTO(
    @SerialName("participant_id") val participantId: Int,
    @SerialName("tournament_id") val tournamentId: Int,
    val name: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ParticipantDTO

        if (participantId != other.participantId) return false
        if (tournamentId != other.tournamentId) return false
        if (name != other.name) return false

        return true
    }

    override fun hashCode(): Int {
        var result = participantId
        result = 31 * result + tournamentId
        result = 31 * result + name.hashCode()
        return result
    }

    override fun toString(): String {
        return "ParticipantDTO(participantId=$participantId, tournamentId=$tournamentId, name='$name')"
    }
}
