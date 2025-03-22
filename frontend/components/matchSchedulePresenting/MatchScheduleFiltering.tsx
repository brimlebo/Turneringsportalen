"use client";

import { MatchOverviewDTO } from "@/utils/types";
import { MatchScheduleTable } from "./MatchScheduleTable";
import { Flex, Table } from "@radix-ui/themes";
import { useState } from "react";
import { MultiSelect } from "../MultiSelect";

type MatchScheduleFilteringProps = {
  matches: {
    timeKey: string;
    matches: MatchOverviewDTO[];
  }[];
};

export function MatchScheduleFiltering({
  matches,
}: MatchScheduleFilteringProps) {
  const fields = Array.from(
    new Map(
      matches.flatMap((group) =>
        group.matches.map((match) => [
          match.game_location.game_location_id,
          {
            key: match.game_location.game_location_id,
            text: match.game_location.name,
          },
        ])
      )
    ).values()
  );

  const participants = Array.from(
    new Map(
      matches.flatMap((group) =>
        group.matches.flatMap((match) => [
          [
            match.participants[0].participant_id ?? 0,
            {
              key: match.participants[0].participant_id ?? 0,
              text: match.participants[0].name,
            },
          ],
          [
            match.participants[1].participant_id ?? 0,
            {
              key: match.participants[1].participant_id ?? 0,
              text: match.participants[1].name,
            },
          ],
        ])
      )
    ).values()
  );

  const times = Array.from(
    new Set(
      matches.flatMap((group) => group.matches.map((match) => match.time))
    )
  ).map((time) => ({ key: time, text: time }));

  const dates = Array.from(
    new Set(
      matches.flatMap((group) => group.matches.map((match) => match.date))
    )
  ).map((date) => ({ key: date, text: date }));

  const [selectedFields, setSelectedFields] = useState<(string | number)[]>(
    fields.map((field) => String(field.key))
  );

  const [selectedParticipants, setSelectedParticipants] = useState<
    (string | number)[]
  >(participants.map((participant) => String(participant.key)));

  const [selectedTimes, setSelectedTimes] = useState<(string | number)[]>(
    times.map((time) => String(time.key))
  );

  const [selectedDates, setSelectedDates] = useState<(string | number)[]>(
    dates.map((date) => String(date.key))
  );

  const [filteredMatches, setFilteredMatches] = useState(matches);

  const handleFilterChange = (
    fields: (string | number)[],
    participants: (string | number)[],
    times: (string | number)[],
    dates: (string | number)[]
  ) => {
    console.log(fields, participants, times, dates);
    if (
      fields.length === 0 ||
      participants.length === 0 ||
      times.length === 0 ||
      dates.length === 0
    ) {
      console.log("empty");
      setFilteredMatches([]);
      return;
    }

    const newFilteredMatches = matches
      .map((group) => ({
        ...group,
        matches: group.matches.filter(
          (match) =>
            fields.includes(String(match.game_location.game_location_id)) &&
            (participants.includes(
              String(match.participants[0].participant_id ?? 0)
            ) ||
              participants.includes(
                String(match.participants[1].participant_id ?? 0)
              )) &&
            times.includes(String(match.time)) &&
            dates.includes(String(match.date))
        ),
      }))
      .filter((group) => group.matches.length > 0);

    setFilteredMatches(newFilteredMatches);
  };

  const handleFieldSelectionChange = (selectedKeys: (string | number)[]) => {
    setSelectedFields(selectedKeys);
    handleFilterChange(
      selectedKeys,
      selectedParticipants,
      selectedTimes,
      selectedDates
    );
  };

  const handleParticipantSelectionChange = (
    selectedKeys: (string | number)[]
  ) => {
    setSelectedParticipants(selectedKeys);
    handleFilterChange(
      selectedFields,
      selectedKeys,
      selectedTimes,
      selectedDates
    );
  };

  const handleTimeSelectionChange = (selectedKeys: (string | number)[]) => {
    setSelectedTimes(selectedKeys);
    handleFilterChange(
      selectedFields,
      selectedParticipants,
      selectedKeys,
      selectedDates
    );
  };

  const handleDateSelectionChange = (selectedKeys: (string | number)[]) => {
    setSelectedDates(selectedKeys);
    handleFilterChange(
      selectedFields,
      selectedParticipants,
      selectedTimes,
      selectedKeys
    );
  };

  return (
    <div>
      <Flex style={{ padding: "1rem", paddingLeft: "0" }} gap={"4"}>
        <MultiSelect
          triggerText="Select fields"
          items={fields}
          onSelectionChange={handleFieldSelectionChange}
        />
        <MultiSelect
          triggerText="Select participants"
          items={participants}
          onSelectionChange={handleParticipantSelectionChange}
        />
        <MultiSelect
          triggerText="Select times"
          items={times}
          onSelectionChange={handleTimeSelectionChange}
        />
        <MultiSelect
          triggerText="Select dates"
          items={dates}
          onSelectionChange={handleDateSelectionChange}
        />
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 1</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 2</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <MatchScheduleTable matches={filteredMatches} />
        </Table.Body>
      </Table.Root>
    </div>
  );
}
