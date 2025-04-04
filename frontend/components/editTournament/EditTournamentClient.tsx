"use client";

import { Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


import {
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Separator,
} from "@radix-ui/themes";
import { type MatchOverviewDTO, type WholeTournamentDTO, type Match } from "@/utils/types";
import { editTournament} from "@/utils/API";


type Props = {
  id: number;
  wholeTournamentData: WholeTournamentDTO;
};

export default function EditTournamentClient({ id, wholeTournamentData}: Props) { 
  const [schedule, setSchedule] = useState<MatchOverviewDTO[]>(wholeTournamentData.schedule ?? []);
  const [tournamentLocation, setLocation] = useState<string>(wholeTournamentData.tournament.location);
  const [tournamentName, setTournamentName] = useState<string>(wholeTournamentData.tournament.name);
  //const [matchTime, setMatchTime] = useState<string>(new Date(matchData.time)).toISOString().split("T")[0];
  const [matchInterval, setMatchInterval] = useState<number>(wholeTournamentData.tournament.match_interval)
  const [tournamentDate, setTournamentDate] = useState<string>(
    new Date(wholeTournamentData.tournament.start_date).toISOString().split("T")[0]
  );

  const router = useRouter();

  const [groupBy, setGroupBy] = useState<"time" | "team" | "field">("time");
   
  

  function getParticipantName(id: number): string {
    const participant = wholeTournamentData.participants.find(p => p.participant_id === id);
    return participant?.name ?? "Participant name not set";
  }

  function groupMatches(schedule: MatchOverviewDTO[]) {
    switch (groupBy) {
      case "field":
        return groupByField(schedule);
      case "team":
        return groupByTeam(schedule);
      case "time":
        return groupByTime(schedule);
      default:
        return groupByTime(schedule);
    }
  }


  function groupByTeam(matches: MatchOverviewDTO[]) {
    const groups: Record<string, MatchOverviewDTO[]> = {};
    for (const match of matches) {
      for (const p of match.participants) {
        if (!groups[p.name]) groups[p.name] = [];
        groups[p.name].push(match);
      }
    }
    return groups;
  }

  function groupByTime(matches: MatchOverviewDTO[]){
      //return [...matches].sort((a, b) => a.time.localeCompare(b.time));
        return {
          "All matches (by time)": [...matches].sort((a, b) => a.time.localeCompare(b.time))
        };
      }
  
  function groupByField(matches: MatchOverviewDTO[]) {
    return matches.reduce((acc, match) => {
      const key = match.game_location.name;
      acc[key] = acc[key] || [];
      acc[key].push(match);
      return acc;
    }, {} as Record<string, MatchOverviewDTO[]>);
  }
  
  async function handleSave() {
    try {

      await editTournament({
        tournament_id: wholeTournamentData.tournament.tournament_id!,
        name: tournamentName,
        start_date: new Date(tournamentDate).toISOString(),
        location: tournamentLocation,
        match_interval: matchInterval,
      });
  
      // await Promise.all(schedule.map((match) =>
      //   updateMatch({
      //     match_id: match.match_id!,
      //     tournament_id: wholeTournamentData.tournament.tournament_id,
      //     time: new Date(`${tournamentDate}T${match.time}`).toISOString(), 
      //     game_location_id: match.game_location.game_location_id,
      //   })
      // ));
      
      
      //alert("Tournament updated!");
      router.push(`/tournaments/${wholeTournamentData.tournament.tournament_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save tournament in Client");
    }
  }
  
 
  
  return (
    <Container>
      <Flex direction="column" gap="1" mb="4">
        <TextField.Root
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          style={{
            all: "unset",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            border: "none",
            borderBottom: "none",
            outline: "none",
            background: "transparent",
          }}
        />
      </Flex>

      <Flex direction="column" gap="2" mb="4">
        
      <Flex direction="column" gap="2" mb="4" align="center">
  <label
    htmlFor="tournament_date"
    style={{
      fontWeight: "500",
      color: "var(--text-color)",
    }}
  >
    
  </label>
  <input
    id="tournament_date"
    name="tournament_date"
    type="date"
    value={tournamentDate}
    onChange={(e) => setTournamentDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]}
    max={
      new Date(new Date().setFullYear(new Date().getFullYear() + 2))
        .toISOString()
        .split("T")[0]
    }
    style={{
      color: "var(--text-color)",
      padding: "14px",
      borderRadius: "8px",
      backgroundColor: "var(--input-color)",
      border: "1px solid var(--border-color)",
    }}
  />
</Flex>

      </Flex>
  
      <Flex align="center" gap="2" my="3">
      <Text></Text>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)}
             style={{
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "var(--background-color)",
              fontSize: "0.95rem",
              minWidth: "140px",
            }}>
          <option value="team">Team</option>
          <option value="field">Field</option>
          <option value="time">Time</option>
         
        </select>
        
      </Flex>
  
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Team A</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Team B</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Field</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
  
        <Table.Body>
          {Object.entries(groupMatches(schedule)).map(([groupLabel, matches]) => (
            <React.Fragment key={groupLabel}>
              <Table.Row>
                <Table.Cell colSpan={4} style={{ background: "var(--background-color)", fontWeight: "bold" }}>
                  {groupLabel}
                </Table.Cell>
              </Table.Row>
  
              {matches.map((match, index) => (
                <Table.Row key={match.match_id}>
                  <Table.Cell>
                    {match.time}
                   
                  </Table.Cell>
  
                  <Table.Cell>
                    <select
                      value={match.participants[0]?.participant_id ?? ""}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].participants[0] = {
                          participant_id: Number(e.target.value),
                          name: getParticipantName(Number(e.target.value)),
                        };
                        setSchedule(updated);
                      }}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "var(--background-color)",
                        fontSize: "0.95rem",
                        minWidth: "140px",

                      }

                      }
                    >
                      <option value="">Select Team</option>
                      {wholeTournamentData.participants.map((p) => (
                        <option
                          key={p.participant_id}
                          value={p.participant_id}
                          disabled={p.participant_id === match.participants[1]?.participant_id}
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Table.Cell>
  
                  <Table.Cell>
                    <select
                      value={match.participants[1]?.participant_id ?? ""}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].participants[1] = {
                          participant_id: Number(e.target.value),
                          name: getParticipantName(Number(e.target.value)),
                        };
                        
                        setSchedule(updated);
                      }}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "var(--background-color)",
                        fontSize: "0.95rem",
                        minWidth: "140px",

                      }

                      }
                    >
                      <option value="">Select Team</option>
                      {wholeTournamentData.participants.map((p) => (
                        <option
                          key={p.participant_id}
                          value={p.participant_id}
                          disabled={p.participant_id === match.participants[0]?.participant_id}
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Table.Cell>
  
                  <Table.Cell>
                  <select
                    value={match.game_location.game_location_id}
                    onChange={(e) => {
                      const updated = [...schedule];
                      updated[index].game_location = {
                        game_location_id: Number(e.target.value),
                        name:
                          wholeTournamentData.field_names.find(
                            (f) => f.field_id === Number(e.target.value)
                          )?.field_name ?? "Unknown",
                      };
                      setSchedule(updated);
                    }}
                    style={{
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      backgroundColor: "var(--background-color)",
                      fontSize: "0.95rem",
                      minWidth: "140px",
                    }}
                  >
                    {wholeTournamentData.field_names.map((field) => (
                      <option key={field.field_id} value={field.field_id}>
                        {field.field_name}
                      </option>
                    ))}
                  </select>
                </Table.Cell>


                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
  
      <Separator my="4" />
      <Button onClick={handleSave}>Save Tournament</Button>
    </Container>
  );
  }

