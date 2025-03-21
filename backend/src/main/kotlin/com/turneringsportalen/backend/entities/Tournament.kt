package com.turneringsportalen.backend.entities

import kotlinx.datetime.Instant
import kotlinx.datetime.serializers.InstantIso8601Serializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Tournament(
    @SerialName("tournament_id") val tournamentId: Int? = null, // Allow null so it won't be sent
    val name: String,
    @SerialName("start_date") @Serializable(with = InstantIso8601Serializer::class) val startDate: Instant,
    val location: String,
    @SerialName("match_interval") val matchInterval: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Tournament

        if (tournamentId != other.tournamentId) return false
        if (name != other.name) return false
        if (startDate != other.startDate) return false
        if (location != other.location) return false
        if (matchInterval != other.matchInterval) return false

        return true
    }

    override fun hashCode(): Int {
        var result = tournamentId ?: 0
        result = 31 * result + name.hashCode()
        result = 31 * result + startDate.hashCode()
        result = 31 * result + location.hashCode()
        result = 31 * result + matchInterval
        return result
    }

    override fun toString(): String {
        return "Tournament(tournamentId=$tournamentId, name='$name', startDate=$startDate, location='$location', matchInterval=$matchInterval)"
    }
}
