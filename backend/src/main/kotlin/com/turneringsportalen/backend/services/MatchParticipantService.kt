package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.Match
import com.turneringsportalen.backend.entities.MatchParticipant
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable

@Service
class MatchParticipantService(private val client: SupabaseClient) {


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

    suspend fun addMatchParticipant(matchParticipant: MatchParticipant){
        client.from("match_participant").insert(matchParticipant)

    }

    suspend fun deleteMatchParticipant(id: Int){
        client.from("match_participant").delete{
            filter{
                eq("participant_id", id)
            }
        }
    }

    suspend fun updateMatchParticipants(matchId: Int, participantId: Int, index: Int){
        client.from("match_participant").update(
            {
            set("match_id", matchId)
            set("participant_id", participantId)
            set("index", index)
        }
        )
    }
}