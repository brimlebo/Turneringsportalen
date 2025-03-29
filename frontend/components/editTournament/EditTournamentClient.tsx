"use client";

import { Table } from "@radix-ui/themes";
import React, { useState } from "react";

import {
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Separator,
} from "@radix-ui/themes";
import { type MatchOverviewDTO, type WholeTournamentDTO } from "@/utils/types";
import { editTournament } from "@/utils/API";

type Props = {
  id: number;
  wholeTournamentData: WholeTournamentDTO;
};

export default function EditTournamentClient({ id, wholeTournamentData}: Props) { 
  const [schedule, setSchedule] = useState<MatchOverviewDTO[]>(wholeTournamentData.schedule ?? []);
  const [tournamentName, setTournamentName] = useState<string>(wholeTournamentData.tournament.name);
  const [tournamentDate, setTournamentDate] = useState<Date>(wholeTournamentData.tournament.start_date);
  const [groupBy, setGroupBy] = useState<"none" | "team" | "field" | "time">("none");

  function getParticipantName(id: number): string {
    const participant = wholeTournamentData.participants.find(p => p.participant_id === id);
    return participant?.name ?? "Participant name not set";
  }

  function groupMatches(schedule: MatchOverviewDTO[]) {
    switch (groupBy) {
      case "field":
        return groupByField(schedule);
      case "time":
        return groupByTime(schedule);
      case "team":
        return groupByTeam(schedule);
      default:
        return { All: schedule };
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
  
  function groupByField(matches: MatchOverviewDTO[]) {
    return matches.reduce((acc, match) => {
      const key = match.game_location.name;
      acc[key] = acc[key] || [];
      acc[key].push(match);
      return acc;
    }, {} as Record<string, MatchOverviewDTO[]>);
  }
  
  function groupByTime(matches: MatchOverviewDTO[]) {
    return matches.reduce((acc, match) => {
      const key = new Date(match.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      acc[key] = acc[key] || [];
      acc[key].push(match);
      return acc;
    }, {} as Record<string, MatchOverviewDTO[]>);
  }
  

  async function handleSave() {
    try {
      await editTournament({
        tournament: {
          ...wholeTournamentData.tournament,
          // inline edits like name/location can go here if needed
        },
        participants: wholeTournamentData.participants,
        schedule,
        field_names: wholeTournamentData.field_names,
      });
      alert("Tournament updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save tournament");
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

      {/* <Flex direction="column" gap="2" mb="4">
          <TextField.Root
            value={tournamentDate}
            onChange={(e) => setTournamentDate(e.target.valueAsDate)}

          />


      </Flex>
   */}
      <Flex align="center" gap="2" my="3">
        <Text>Group by:</Text>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)}>
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
                <Table.Cell colSpan={4} style={{ background: "#f7f7f7", fontWeight: "bold" }}>
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
  
                  <Table.Cell>{match.game_location.name}</Table.Cell>
                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
  
      <Separator my="4" />
      <Button onClick={handleSave}>Save Tournament</Button>
    </Container>
  ); // <-- this closes the return
  } // <-- this closes the function
  
