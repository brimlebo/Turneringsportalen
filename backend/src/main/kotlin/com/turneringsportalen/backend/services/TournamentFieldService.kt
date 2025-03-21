package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.TournamentField
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import org.springframework.stereotype.Service

@Service
class TournamentFieldService(private val client: SupabaseClient) {

    suspend fun findAllTournamentFields(): List<TournamentField>{
        return client.from("available_fields").select().decodeList<TournamentField>()
    }

    suspend fun findTournamentFieldById(id: Int): TournamentField{
        return client.from("available_fields").select {
            filter{
                eq("field_id", id)
            }
        }.decodeSingle()
    }

    suspend fun addTournamentField(tournamentField: TournamentField){
       client.from("available_fields").insert(tournamentField)
    }

    suspend fun deleteTournamentField(id: Int){
        client.from("available_fields").delete{
            filter{
                eq("field_id", id)
            }
        }
    }

    suspend fun updateTournamentField(tournamentField: TournamentField) {
        client.from("available_fields").update(
            {
                set("field_id", tournamentField.fieldId)
                set("tournament_id", tournamentField.tournamentId)
                set("field_name", tournamentField.fieldName)
            }
        ) {
            filter {
                eq("field_id", tournamentField.fieldId ?: 0)
            }
        }
    }
}
