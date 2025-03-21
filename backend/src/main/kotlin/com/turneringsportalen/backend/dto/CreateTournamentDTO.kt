package com.turneringsportalen.backend.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateTournamentDTO(
    val name: String,
    @SerialName("start_date") val startDate: Instant,
    val location: String,
    @SerialName("match_interval") val matchInterval: Int,
    @SerialName("field_names") val fieldNames: List<String> = emptyList() // Ensure it has a default value
) {
    override fun toString(): String {
        return "CreateTournamentDTO(name='$name', startDate=$startDate, location='$location', matchInterval=$matchInterval, fieldNames=$fieldNames)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as CreateTournamentDTO

        if (name != other.name) return false
        if (startDate != other.startDate) return false
        if (location != other.location) return false
        if (matchInterval != other.matchInterval) return false
        if (fieldNames != other.fieldNames) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + startDate.hashCode()
        result = 31 * result + location.hashCode()
        result = 31 * result + matchInterval
        result = 31 * result + fieldNames.hashCode()
        return result
    }
}
