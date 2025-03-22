import { MatchOverviewDTO } from "@/utils/types";
import { Table } from "@radix-ui/themes";

type MatchScheduleTableProps = {
  matches: {
    timeKey: string;
    matches: MatchOverviewDTO[];
  }[];
};

export function MatchScheduleTable({ matches }: MatchScheduleTableProps) {
  return matches.flatMap((group, groupIndex) => [
    ...group.matches.map((match) => (
      <Table.Row key={match.match_id}>
        <Table.Cell>{match.time}</Table.Cell>
        <Table.Cell>{match.participants[0].name}</Table.Cell>
        <Table.Cell>{match.participants[1].name}</Table.Cell>
        <Table.Cell>{match.date}</Table.Cell>
        <Table.Cell>{match.game_location.name}</Table.Cell>
      </Table.Row>
    )),
    // Add a blank row after each group except the last one
    groupIndex < matches.length - 1 && (
      <Table.Row key={`blank-${groupIndex}`}>
        <Table.Cell colSpan={5}>&nbsp;</Table.Cell>
      </Table.Row>
    ),
  ]);
}
