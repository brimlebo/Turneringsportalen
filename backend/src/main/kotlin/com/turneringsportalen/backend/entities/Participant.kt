package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Participant(
    @SerialName("participant_id") val participantId: Int? = null, // Allow null so it won't be sent,
    @SerialName("tournament_id") val tournamentId: Int,
    val name: String
) {
    override fun toString(): String {
        return "Participant(participantId=$participantId, tournamentId=$tournamentId, name='$name')"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Participant

        if (participantId != other.participantId) return false
        if (tournamentId != other.tournamentId) return false
        if (name != other.name) return false

        return true
    }

    override fun hashCode(): Int {
        var result = participantId ?: 0
        result = 31 * result + tournamentId
        result = 31 * result + name.hashCode()
        return result
    }
}
