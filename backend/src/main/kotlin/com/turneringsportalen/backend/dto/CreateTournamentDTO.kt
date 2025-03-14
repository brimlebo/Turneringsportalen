package com.turneringsportalen.backend.daos

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
)
