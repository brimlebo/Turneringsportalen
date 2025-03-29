import EditTournamentClient from "./EditTournamentClient";
import { fetchTournamentById } from "@/utils/API";
import { WholeTournamentDTO } from "@/utils/types";

type Props = {
  id: number;
};

export default async function EditTournamentView({ id }: Props) {
  const tournament: WholeTournamentDTO = await fetchTournamentById(id);
  return <EditTournamentClient id={id} wholeTournamentData={tournament} />;
}
