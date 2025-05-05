import EditTournamentView from "@/components/editTournament/EditTournamentView";

type Props = {
  params: { tournament_id: string };
};

export default async function EditTournamentPage(props: {
  params: Promise<{ tournament_id: string }>;
}) {
  const params = await props.params;
  return (
    <div style={{ backgroundColor: "var(--mainBg)", minHeight: "100vh" }}>
      <EditTournamentView id={parseInt(params.tournament_id)} />
    </div>
  );
}
