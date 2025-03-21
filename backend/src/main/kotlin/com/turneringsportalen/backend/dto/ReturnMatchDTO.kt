package com.turneringsportalen.backend.dto

import com.turneringsportalen.backend.entities.Match
import com.turneringsportalen.backend.entities.Participant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ReturnMatchDTO(
    @SerialName("match") val match : Match,
    @SerialName("participants") val participants : List<Participant>
)
