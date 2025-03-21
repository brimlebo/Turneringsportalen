import { MatchOverviewDTO } from "@/utils/types";
import { Table } from "@radix-ui/themes";

type MatchScheduleTableProps = {
  matches: {
    timeKey: string;
    matches: MatchOverviewDTO[];
  }[];
};

export function MatchScheduleTable({ matches }: MatchScheduleTableProps) {
  return (
    <div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 1</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 2</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {matches.map((group) =>
            group.matches.map((match) => (
              <Table.Row key={match.match_id}>
                <Table.Cell>{match.date}</Table.Cell>
                <Table.Cell>{match.participants[0].name}</Table.Cell>
                <Table.Cell>{match.time}</Table.Cell>
                <Table.Cell>{match.participants[1].name}</Table.Cell>
                <Table.Cell>{match.game_location.name}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
