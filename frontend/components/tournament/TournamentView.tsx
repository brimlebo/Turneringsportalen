import { Container, Flex, Text, Strong, Heading, Box, Card, Avatar, Table } from "@radix-ui/themes";
import type { Tournament, Participant, Match, TournamentWithParticipantsAndMatches } from "../../utils/types";
import { fetchTournamentById } from "@/utils/API";


type Props = {
    id: number;
};

export default async function TournamentView({ id }: Props) {
    let tournament: Tournament = await fetchTournamentById(id);
    const { name, start_date, location, match_interval } = tournament;

    /// TEMPORARY DATA (ENDPOINTS NOT IMPLEMENTED YET)
    let participants: Participant[] = [{
        participant_id: 1, name: "Brann FK",
        tournament_id: 0
    }, {
        participant_id: 2, name: "Laksevåg FK",
        tournament_id: 0
    }, {
        participant_id: 3, name: "Åsane FK",
        tournament_id: 0
    }, {
        participant_id: 4, name: "Fyllingsdalen FK",
        tournament_id: 0
    }];

    let matches: Match[] = [{
        match_id: 1, time: new Date(), game_location_id: 0, tournament_id: 0
    }, {
        match_id: 2, time: new Date(), game_location_id: 1, tournament_id: 0
    }, {
        match_id: 3, time: new Date(), game_location_id: 2, tournament_id: 0
    }];
    /// END TEMPORARY DATA

    console.log(tournament);

    return (
        <Container>
            <Flex>
                <Heading as="h1">{name}</Heading>
            </Flex>
            <Flex direction="row" align="center" gap="9">
                <Flex direction={"column"} gap="3">
                    <Text><Strong>Start Date: </Strong> {new Date(start_date).toLocaleDateString()}</Text>
                    <Text><Strong>Start Time: </Strong> {new Date(start_date).toLocaleTimeString()}</Text>
                    <Text><Strong>Location: </Strong> {location}</Text>
                    <Text><Strong>Time Between Matches: </Strong>{match_interval} min</Text>
                </Flex>
                <Flex direction={"column"} gap="3">
                    <Text><Strong>Participants: </Strong></Text>
                    <Flex gap="3">
                        {participants.map((participant) => <Box width={"200px"} height={"200px"} key={participant.participant_id}>
                            <Card>
                                <Flex gap="1" align="center" direction={"column"}>
                                    <Avatar
                                        size="6"
                                        fallback={participant.name.split(" ").map((name) => name[0]).join("")}
                                    ></Avatar>
                                    {participant.name}
                                </Flex>
                            </Card>

                        </Box>)}
                    </Flex>
                </Flex>
            </Flex>
            <Flex>
                <Text><Strong>Matches</Strong></Text>
            </Flex>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Match ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Participant 1</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Participant 2</Table.ColumnHeaderCell>

                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Game Location</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                                 <Table.Body>
                    {matches.map((match) => (
                        
                        <Table.Row key={match.match_id}>
                            <Table.Cell>{new Date(match.time).toLocaleTimeString()}</Table.Cell>
                            <Table.Cell>{match.match_id}</Table.Cell>
                            <Table.Cell>{""}</Table.Cell>
                            <Table.Cell>{""}</Table.Cell>
                            <Table.Cell>{new Date(match.time).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>{match.game_location_id}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body> 
            </Table.Root>
        </Container>
    );
}
//{participants.map((participant) => participant.name).join(", ")}

//{matches.map((match) => match.match_id).join(", ")}
