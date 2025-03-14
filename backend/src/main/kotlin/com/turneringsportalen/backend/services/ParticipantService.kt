package com.turneringsportalen.backend.services
import com.turneringsportalen.backend.entities.*
import org.springframework.stereotype.Service
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from

@Service
class ParticipantService(private val client: SupabaseClient) {

    suspend fun findAllParticipants(): List<Participant>? {
        return client.from("participant").select().decodeList<Participant>()

    }

    suspend fun findMatchParticipantById(id: Int): Participant? {

        return client.from("participant").select {
            filter {
                eq("participant_id", id)
            }
        }.decodeSingle<Participant>()
    }

    suspend fun addMatchParticipant(participant: Participant) {

        client.from("participant").insert(participant)
    }

    suspend fun deleteMatchParticipant(participant: Participant) {
        client.from("participant").delete {
            filter {
                eq("participant_id", participant.participantId ?: 0)
            }
        }
    }

    fun updateMatchParticipants(){

    }
}


