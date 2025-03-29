import EditTournamentView from "@/components/editTournament/EditTournamentView";



type Props = {
  params: { tournament_id: string };
};

export default async function EditTournamentPage({ params }: Props) {
  const id = await Number(params.tournament_id); 

  return <EditTournamentView id={id} />;
}
