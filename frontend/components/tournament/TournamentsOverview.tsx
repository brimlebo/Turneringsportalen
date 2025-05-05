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
} from "@radix-ui/themes";
import { Tournament } from "@/utils/types";
import { fetchTournaments } from "@/utils/API";

export default async function TournamentsOverview() {
  const tournaments: Tournament[] = await fetchTournaments();

  if (!tournaments) {
    return (
      <p style={{ color: "var(--highlighter1)" }}>No tournaments found.</p>
    );
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid gap="9" columns={{ initial: "1", xs: "2", md: "3", lg: "4" }}>
        {tournaments.map((tournament) => (
          <Box key={tournament.tournament_id}>
            <Card
              asChild
              variant="ghost"
              style={{
                padding: "28px",
                backgroundColor: "var(--secondaryBg)",
                border: "1px solid var(--highlighter2)",
              }}
            >
              <a href={`/tournaments/${tournament.tournament_id}`}>
                <Heading
                  as="h2"
                  style={{ marginBottom: "16px", color: "var(--highlighter2)" }}
                >
                  {tournament.name}
                </Heading>
                <Flex gap="3" direction={"column"}>
                  <Text style={{ color: "var(--highlighter1)" }}>
                    <Strong style={{ color: "var(--highlighter2)" }}>
                      Start Date:{" "}
                    </Strong>{" "}
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </Text>
                  <Text style={{ color: "var(--highlighter1)" }}>
                    <Strong style={{ color: "var(--highlighter2)" }}>
                      Location:{" "}
                    </Strong>{" "}
                    {tournament.location}
                  </Text>
                  <Text style={{ color: "var(--highlighter1)" }}>
                    <Strong style={{ color: "var(--highlighter2)" }}>
                      Match interval:{" "}
                    </Strong>
                    {tournament.match_interval}
                  </Text>
                </Flex>
              </a>
            </Card>
          </Box>
        ))}
      </Grid>
    </Container>
  );
}
