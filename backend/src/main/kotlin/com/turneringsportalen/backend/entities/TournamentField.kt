package com.turneringsportalen.backend.entities

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TournamentField (
    @SerialName("field_id") val fieldId : Int? = null, // Allow null so it won't be sent,
    @SerialName("tournament_id") val tournamentId : Int,
    @SerialName("field_name") val fieldName : String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as TournamentField

        if (fieldId != other.fieldId) return false
        if (tournamentId != other.tournamentId) return false
        if (fieldName != other.fieldName) return false

        return true
    }

    override fun hashCode(): Int {
        var result = fieldId ?: 0
        result = 31 * result + tournamentId
        result = 31 * result + fieldName.hashCode()
        return result
    }

    override fun toString(): String {
        return "TournamentField(fieldId=$fieldId, tournamentId=$tournamentId, fieldName='$fieldName')"
    }
}
