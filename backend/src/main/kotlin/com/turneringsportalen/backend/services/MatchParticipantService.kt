package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.MatchParticipant
import com.turneringsportalen.backend.entities.Participant
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import org.springframework.stereotype.Service

@Service
class MatchParticipantService(private val client: SupabaseClient) {

    suspend fun addMatchParticipant(matchParticipant: MatchParticipant){
        client.from("match_participant").insert(matchParticipant)
    }

    suspend fun findAllMatchParticipants(): List<MatchParticipant>{
        return client.from("match_participant").select().decodeList<MatchParticipant>()
    }

    suspend fun findMatchParticipantById(id: Int): MatchParticipant{
        return client.from("match_participant").select {
            filter{
                eq("participant_id", id)
            }
        }.decodeSingle()
    }

    suspend fun deleteMatchParticipant(id: Int){
        client.from("match_participant").delete{
            filter{
                eq("participant_id", id)
            }
        }
    }

    // Currently no api-endpoint, pending figuring out what to give in
    suspend fun updateMatchParticipant(matchId: Int, participantId: Int, index: Int){
        client.from("match_participant").update(
            {
            set("match_id", matchId)
            set("participant_id", participantId)
            set("index", index)
        }
        ){
            filter {
                eq("match_id", matchId)
                eq("participant_id", participantId)
            }
        }
    }

    suspend fun findMatchParticipantsByMatchId(id: Int): List<Participant>? {
        val matchParticipantsIds = client.from("match_participant").select {
            filter {
                eq("match_id", id)
            }
        }.decodeList<MatchParticipant>().map { it.participantId }

        if (matchParticipantsIds.isEmpty()) {
            return null
        }

        return client.from("participant").select {
            filter {
                isIn("participant_id", matchParticipantsIds)
            }
        }.decodeList<Participant>()
    }
}
