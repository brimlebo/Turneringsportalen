package com.turneringsportalen.backend.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class Match(
        val matchId : Int,
        val participants : MutableSet<Participant> = mutableSetOf(), // Might have to be changed  based on supabase
        val time : Instant,
        val gameLocation : String
)