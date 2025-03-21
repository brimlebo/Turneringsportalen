import { Container, Flex, Text, Strong, Heading, Box, Card, Avatar, Table, Grid } from "@radix-ui/themes";
import { Tournament } from "@/utils/types";
import { fetchTournaments } from "@/utils/API";


export default async function TournamentsOverview() {
    
    const tournaments: Tournament[] = await fetchTournaments();

    console.log("TOURNAMENTS OVERVIEW", tournaments);
    
    if (!tournaments) {
        return (<h1></h1>);
    }

    return (
        <Container>
            <Grid gap="6" columns={{ xs: '1', md: '2', lg: '3' }}>
                {tournaments.map((tournament) => 
                <Box key={tournament.tournament_id}>
                    <Card asChild>
                        <a href={`/tournaments/${tournament.tournament_id}`}>
                        <Heading as="h2">{tournament.name}</Heading>
                            <Flex gap="1" direction={"column"}>
                                <Text><Strong>Start Date: </Strong> {new Date(tournament.start_date).toLocaleDateString()}</Text>
                                <Text><Strong>Location: </Strong> {tournament.location}</Text>
                                <Text><Strong>Match interval: </Strong>{tournament.match_interval}</Text>
                            </Flex>
                        </a>
                    </Card>
                </Box>)}
            </Grid>

        </Container>
    );
}
