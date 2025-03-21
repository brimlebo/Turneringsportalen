package com.turneringsportalen.backend.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MatchDTO(
   @SerialName("match_id") val matchId : Int,
   @SerialName("tournament_id") val tournamentId : Int,
   val time : Instant,
   @SerialName("game_location_id") val gameLocationId: Int
) {
   override fun equals(other: Any?): Boolean {
      if (this === other) return true
      if (javaClass != other?.javaClass) return false

      other as MatchDTO

      if (matchId != other.matchId) return false
      if (tournamentId != other.tournamentId) return false
      if (time != other.time) return false
      if (gameLocationId != other.gameLocationId) return false

      return true
   }

   override fun hashCode(): Int {
      var result = matchId
      result = 31 * result + tournamentId
      result = 31 * result + time.hashCode()
      result = 31 * result + gameLocationId
      return result
   }

   override fun toString(): String {
      return "MatchDTO(matchId=$matchId, tournamentId=$tournamentId, time=$time, gameLocationId=$gameLocationId)"
   }
}
