package com.turneringsportalen.backend.entities

import kotlinx.datetime.Instant
import kotlinx.datetime.serializers.InstantIso8601Serializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Match(
    @SerialName("match_id") val matchId: Int,
    @SerialName("tournament_id") val tournamentId: Int,
    @SerialName("time") @Serializable(with = InstantIso8601Serializer::class) val time: Instant,
    @SerialName("game_location_id") val gameLocationId: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Match

        if (matchId != other.matchId) return false
        if (tournamentId != other.tournamentId) return false
        if (time != other.time) return false
        if (gameLocationId != other.gameLocationId) return false

        return true
    }

    override fun hashCode(): Int {
        var result = matchId
        result = 31 * result + tournamentId
        result = 31 * result + time.hashCode()
        result = 31 * result + gameLocationId
        return result
    }

    override fun toString(): String {
        return "Match(matchId=$matchId, tournamentId=$tournamentId, time=$time, gameLocationId=$gameLocationId)"
    }
}
