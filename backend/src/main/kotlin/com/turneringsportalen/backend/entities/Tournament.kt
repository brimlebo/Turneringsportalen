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
)
