import {
  Container,
  Flex,
  Text,
  Strong,
  Heading,
  Box,
  Card,
  Avatar,
  Grid,
} from "@radix-ui/themes";
import type { WholeTournamentDTO } from "../../utils/types";
import { fetchTournamentById } from "@/utils/API";
import { MatchScheduleFiltering } from "../matchSchedulePresenting/MatchScheduleFiltering";
import React from "react";
import TournamentViewButtonArea from "./TournamentViewButtonArea";

type Props = {
  id: number;
};

export default async function TournamentView({ id }: Props) {
  const wholeTournament: WholeTournamentDTO = await fetchTournamentById(id);
  const { tournament, participants, schedule } = wholeTournament;

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
          <Heading size={"6"} as="h1" style={{ color: "var(--highlighter2)" }}>
            {tournament.name}
          </Heading>
          <TournamentViewButtonArea scheduleExists={!!schedule} id={id} />
        </Flex>

        {/* Tournament Details */}
        <Flex direction="column" align="start" gap="2" width="100%">
          <Heading size={"5"} as="h2" style={{ color: "var(--highlighter2)" }}>
            Tournament Details
          </Heading>
          <Flex direction={"row"} gap="8" wrap="wrap">
            <Text style={{ color: "var(--highlighter1)" }}>
              <Strong style={{ color: "var(--highlighter2)" }}>
                Tournament Start:{" "}
              </Strong>{" "}
              {new Date(tournament.start_date).toLocaleDateString()}
              {" at "}
              {new Date(tournament.start_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={{ color: "var(--highlighter1)" }}>
              <Strong style={{ color: "var(--highlighter2)" }}>
                Location:{" "}
              </Strong>{" "}
              {tournament.location}
            </Text>
            <Text style={{ color: "var(--highlighter1)" }}>
              <Strong style={{ color: "var(--highlighter2)" }}>
                Time Between Matches:{" "}
              </Strong>
              {tournament.match_interval} min
            </Text>
          </Flex>
        </Flex>

        {/* Participants Section */}
        <Flex direction={"column"} gap="3" width="100%">
          <Heading size="5" style={{ color: "var(--highlighter2)" }}>
            Participants:{" "}
          </Heading>
          <Grid gap="2" columns={{ xs: "2", md: "4", lg: "6" }} width="100%">
            {participants && participants.length > 0 ? (
              participants.map((participant) => (
                <Box
                  width={"150px"}
                  height={"150px"}
                  key={participant.participant_id}
                >
                  <Card
                    style={{
                      padding: "10px",
                      backgroundColor: "var(--secondaryBg)",
                      border: "1px solid var(--highlighter2)",
                    }}
                  >
                    <Flex
                      gap="1"
                      align="center"
                      direction={"column"}
                      style={{ color: "var(--highlighter1)" }}
                    >
                      <Avatar
                        color="tomato"
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
          <Heading size="5" style={{ color: "var(--highlighter2)" }}>
            Matches
          </Heading>
          {!schedule || schedule.length === 0 ? (
            <Box style={{ color: "var(--highlighter1)" }}>
              Schedule not created yet
            </Box>
          ) : (
            <MatchScheduleFiltering matches={schedule} />
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
