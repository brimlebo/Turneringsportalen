package com.turneringsportalen.backend.services

import com.turneringsportalen.backend.entities.Match
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import kotlinx.datetime.Instant
import org.springframework.stereotype.Service

@Service
class MatchService(private val client: SupabaseClient) {

    // Simpler version if you wish to add participants separately
    suspend fun createMatch(match: Match) {
        client.from("match").insert(match)
    }

    suspend fun findAllMatches(): List<Match> {
        return client.from("match").select().decodeList<Match>()
    }

    suspend fun findById(id: Int): Match? {
        return client.from("match").select {
            filter{
                eq("match_id", id)
            }
        }.decodeSingle()
    }

    suspend fun deleteMatch(id: Int){
        client.from("match").delete{
            filter {
                eq("match_id",id)
            }
        }
    }

    suspend fun update(matchId: Int, tournamentId: Int, time: Instant, gameLocationId: Int){
        client.from("match").update(
            {
                set("match_id", matchId)
                set("tournament_id", tournamentId)
                set("time", time)
                set("game_location_id", gameLocationId)
            }
        ){
            filter {
                eq("match_id", matchId)
            }
        }
    }
}
