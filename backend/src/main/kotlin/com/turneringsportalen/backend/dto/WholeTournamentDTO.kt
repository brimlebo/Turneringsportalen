package com.turneringsportalen.backend.dto

import com.turneringsportalen.backend.entities.Participant
import com.turneringsportalen.backend.entities.Tournament
import com.turneringsportalen.backend.entities.TournamentField
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WholeTournamentDTO(
    @SerialName("tournament") val tournament: Tournament,
    @SerialName("participants") val participants: List<Participant> = emptyList(),
    @SerialName("schedule") val schedule: List<ReturnMatchDTO> = emptyList(),
    @SerialName("field_names") val fieldNames: List<TournamentField> = emptyList()
)
