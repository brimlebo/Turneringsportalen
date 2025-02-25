package com.turneringsportalen.backend.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class Tournament(
        val tournamentId: Int,
        val name : String,
        val startDate : Instant, // Compact these two into one?
        val startTime : Instant,
        val location : String,
        val fields : List<String>, // May need to be changed based on how supabase interprets this
        val matchInterval : String
)