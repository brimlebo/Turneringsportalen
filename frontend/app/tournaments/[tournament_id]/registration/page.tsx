import RegisterForTournamentView from "@/components/registerForTournament/RegisterForTournamentView";
import { fetchTournamentByIdBasic } from "@/utils/API";
import { notFound } from "next/navigation";
import { Tournament } from "@/utils/types";
import { JSX } from "react";

// Define the expected shape of the resolved params object based on the folder name [tournament_id]
interface TournamentRegistrationPageParams {
  tournament_id: string; // The dynamic segment name becomes the key, value is string
}

interface TournamentRegistrationPageProps {
  params: Promise<TournamentRegistrationPageParams>;
}

export default async function TournamentRegistrationPage(
  { params }: TournamentRegistrationPageProps // Use the defined Props type and destructure params
): Promise<JSX.Element> {
  // Await the params promise to get the actual parameters object
  const resolvedParams = await params;
  const tournamentIdString = resolvedParams.tournament_id;

  // Parse the ID
  const tournamentId = parseInt(tournamentIdString, 10);
  if (Number.isNaN(tournamentId)) {
    console.error(
      `Invalid tournament_id received in URL: "${tournamentIdString}"`
    );
    notFound(); // Trigger the 404 page
  }

  // Fetch the tournament data using the parsed ID
  const tournament: Tournament | null = await fetchTournamentByIdBasic(
    tournamentId
  );

  // Handle case where tournament is not found by the API
  if (!tournament) {
    notFound();
  }

  // Render the view component, passing the fetched tournament data
  return <RegisterForTournamentView tournament={tournament} />;
}
