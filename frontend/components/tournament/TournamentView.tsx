import {
  Container,
  Flex,
  Text,
  Strong,
  Heading,
  Box,
  Card,
  Avatar,
  Table,
  Grid,
  Button,
} from "@radix-ui/themes";
import type {
  Tournament,
  Participant,
  Match,
  TournamentWithParticipantsAndMatches,
  WholeTournamentDTO,
} from "../../utils/types";
import { createMatchSchedule, fetchTournamentById } from "@/utils/API";
import { MatchScheduleFiltering } from "../matchSchedulePresenting/MatchScheduleFiltering";
import React from "react";
import Link from "next/link";
import TournamentViewButtonArea from "./TournamentViewButtonArea";

type Props = {
  id: number;
};

export default async function TournamentView({ id }: Props) {
  const wholeTournament: WholeTournamentDTO = await fetchTournamentById(id);
  const { tournament, participants, schedule, field_names } = wholeTournament;

  return (
    <Container size="4">
      <Flex
        align="center"
        justify="center"
        direction="column"
        width="100%"
        gap="5"
      >
        {/* Tournament Name */}
        <Flex direction="row" justify="between" width="100%">
          <Heading size={"6"} as="h1">
            {tournament.name}
          </Heading>
          <TournamentViewButtonArea scheduleExists={!!schedule} id={id} />
        </Flex>

        {/* Tournament Details */}
        <Flex direction="column" align="start" gap="2" width="100%">
          <Heading size={"5"} as="h2">
            Tournament Details
          </Heading>
          <Flex direction={"row"} gap="8" wrap="wrap">
            <Text>
              <Strong>Tournament Start: </Strong>{" "}
              {new Date(tournament.start_date).toLocaleDateString()}
              {" at "}
              {new Date(tournament.start_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text>
              <Strong>Location: </Strong> {tournament.location}
            </Text>
            <Text>
              <Strong>Time Between Matches: </Strong>
              {tournament.match_interval} min
            </Text>
          </Flex>
        </Flex>

        {/* Participants Section */}
        <Flex direction={"column"} gap="3" width="100%">
          <Heading size="5">Participants: </Heading>
          <Grid gap="2" columns={{ xs: "2", md: "4", lg: "6" }} width="100%">
            {participants && participants.length > 0 ? (
              participants.map((participant) => (
                <Box
                  width={"150px"}
                  height={"150px"}
                  key={participant.participant_id}
                >
                  <Card>
                    <Flex gap="1" align="center" direction={"column"}>
                      <Avatar
                        size="6"
                        fallback={participant.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      />
                      {participant.name}
                    </Flex>
                  </Card>
                </Box>
              ))
            ) : (
              <Box style={{ width: "fit-content", gridColumn: "1 / -1" }}>
                Currently no participants in this tournament
              </Box>
            )}
          </Grid>
        </Flex>

        {/* Matches Section */}
        <Flex direction="column" width="100%">
          <Heading size="5">Matches</Heading>
          {!schedule || schedule.length === 0 ? (
            <Box>Schedule not created yet</Box>
          ) : (
            <MatchScheduleFiltering matches={schedule} />
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
