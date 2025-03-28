"use client";

import { MatchOverviewDTO } from "@/utils/types";
import { MatchScheduleTable } from "./MatchScheduleTable";
import { Flex, Table } from "@radix-ui/themes";
import { useState, useEffect, useRef } from "react";
import { MultiSelect } from "../MultiSelect";

type MatchScheduleFilteringProps = {
  matches: MatchOverviewDTO[];
};

interface FilterStates {
  fields: (string | number)[];
  participants: (string | number)[];
  times: (string | number)[];
  dates: (string | number)[];
}

/**
 * Component that filters match data based on selected fields, participants, times, and dates
 * @param object containing the matches defined in the MatchScheduleFilteringProps type
 * @returns a component that contains filters and a table of matches
 */
export function MatchScheduleFiltering({
  matches,
}: MatchScheduleFilteringProps) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && tableRef.current) {
        const headerTop = tableRef.current.offsetTop;
        const scrollPosition = window.scrollY;
        setIsSticky(scrollPosition > headerTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Select the grouping of matches
  const [groupedMatches, setGroupedMatches] = useState(groupByTime());

  // State to keep track of filtered matches
  const [filteredMatches, setFilteredMatches] =
    useState<MatchOverviewDTO[][]>(groupedMatches);

  // Create initial filter items
  const fields = Array.from(
    new Map(
      matches.map((match) => [
        match.game_location.game_location_id,
        {
          key: match.game_location.game_location_id,
          text: match.game_location.name,
        },
      ])
    ).values()
  ).sort((a, b) => a.text.localeCompare(b.text));

  const participants = Array.from(
    new Map(
      matches.flatMap((match) => [
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
    ).values()
  ).sort((a, b) => {
    return a.text.localeCompare(b.text, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const times = Array.from(new Set(matches.map((match) => match.time)))
    .sort()
    .map((time) => ({ key: time, text: time }));

  const dates = Array.from(new Set(matches.map((match) => match.date)))
    .sort()
    .map((date) => ({ key: date, text: date }));

  // Object containing the selected filter states
  const [filterStates, setFilterStates] = useState<FilterStates>({
    fields: fields.map((field) => String(field.key)),
    participants: participants.map((participant) => String(participant.key)),
    times: times.map((time) => String(time.key)),
    dates: dates.map((date) => String(date.key)),
  });

  const handleFilterChange = (newFilterStates: FilterStates) => {
    if (
      newFilterStates.fields.length === 0 ||
      newFilterStates.participants.length === 0 ||
      newFilterStates.times.length === 0 ||
      newFilterStates.dates.length === 0
    ) {
      setFilteredMatches([]);
      return;
    }

    const newFilteredMatches = groupedMatches
      .map((group) =>
        group.filter(
          (match) =>
            newFilterStates.fields.includes(
              String(match.game_location.game_location_id)
            ) &&
            (newFilterStates.participants.includes(
              String(match.participants[0].participant_id ?? 0)
            ) ||
              newFilterStates.participants.includes(
                String(match.participants[1].participant_id ?? 0)
              )) &&
            newFilterStates.times.includes(String(match.time)) &&
            newFilterStates.dates.includes(String(match.date))
        )
      )
      .filter((group) => group.length > 0);

    setFilteredMatches(newFilteredMatches);
  };

  const handleFieldSelectionChange = (selectedKeys: (string | number)[]) => {
    const newFilterStates = {
      ...filterStates,
      fields: selectedKeys,
    };
    setFilterStates(newFilterStates);
    handleFilterChange(newFilterStates);
  };

  const handleParticipantSelectionChange = (
    selectedKeys: (string | number)[]
  ) => {
    const newFilterStates = {
      ...filterStates,
      participants: selectedKeys,
    };
    setFilterStates(newFilterStates);
    handleFilterChange(newFilterStates);
  };

  const handleTimeSelectionChange = (selectedKeys: (string | number)[]) => {
    const newFilterStates = {
      ...filterStates,
      times: selectedKeys,
    };
    setFilterStates(newFilterStates);
    handleFilterChange(newFilterStates);
  };

  const handleDateSelectionChange = (selectedKeys: (string | number)[]) => {
    const newFilterStates = {
      ...filterStates,
      dates: selectedKeys,
    };
    setFilterStates(newFilterStates);
    handleFilterChange(newFilterStates);
  };

  function updateGrouping(newGrouping: "time" | "date" | "field") {
    let newGroupedMatches: MatchOverviewDTO[][];

    switch (newGrouping) {
      case "time":
        newGroupedMatches = groupByTime();
        break;
      case "date":
        newGroupedMatches = groupByDate();
        break;
      case "field":
        newGroupedMatches = groupByField();
        break;
      default:
        newGroupedMatches = groupByTime();
        break;
    }

    setGroupedMatches(newGroupedMatches);

    // update filtered matches based on new grouping
    // done here because if using the old filtered matches, the grouping is one click behind
    const newFilteredMatches = newGroupedMatches
      .map((group) =>
        group.filter(
          (match) =>
            filterStates.fields.includes(
              String(match.game_location.game_location_id)
            ) &&
            (filterStates.participants.includes(
              String(match.participants[0].participant_id ?? 0)
            ) ||
              filterStates.participants.includes(
                String(match.participants[1].participant_id ?? 0)
              )) &&
            filterStates.times.includes(String(match.time)) &&
            filterStates.dates.includes(String(match.date))
        )
      )
      .filter((group) => group.length > 0);

    setFilteredMatches(newFilteredMatches);
  }

  function groupByTime(): MatchOverviewDTO[][] {
    // Group matches by time
    const groupedMatches = matches.reduce(
      (groups: Record<string, MatchOverviewDTO[]>, match: MatchOverviewDTO) => {
        const timeKey = `${match.date} ${match.time}`;
        if (!groups[timeKey]) {
          groups[timeKey] = [];
        }
        groups[timeKey].push(match);
        return groups;
      },
      {}
    );

    // Convert to array of arrays and sort matches within each group by game_location_id
    const matchesArray = Object.values(groupedMatches).map((matches) =>
      matches.sort(
        (a, b) =>
          a.game_location.game_location_id - b.game_location.game_location_id
      )
    );

    // Sort groups by date and time
    matchesArray.sort((a, b) => {
      const timeA = `${a[0].date} ${a[0].time}`;
      const timeB = `${b[0].date} ${b[0].time}`;
      return timeA.localeCompare(timeB);
    });

    return matchesArray;
  }

  function groupByField(): MatchOverviewDTO[][] {
    // Group matches by field
    const groupedMatches = matches.reduce(
      (groups: Record<string, MatchOverviewDTO[]>, match: MatchOverviewDTO) => {
        const fieldKey = String(match.game_location.game_location_id);
        if (!groups[fieldKey]) {
          groups[fieldKey] = [];
        }
        groups[fieldKey].push(match);
        return groups;
      },
      {}
    );

    // Convert to array of arrays and sort matches within each group by time
    const matchesArray = Object.values(groupedMatches).map((matches) =>
      matches.sort((a, b) => {
        const timeA = `${a.date} ${a.time}`;
        const timeB = `${b.date} ${b.time}`;
        return timeA.localeCompare(timeB);
      })
    );

    // Sort groups by field name
    matchesArray.sort((a, b) =>
      a[0].game_location.name.localeCompare(b[0].game_location.name)
    );

    return matchesArray;
  }

  function groupByDate(): MatchOverviewDTO[][] {
    // Group matches by date
    const groupedMatches = matches.reduce(
      (groups: Record<string, MatchOverviewDTO[]>, match: MatchOverviewDTO) => {
        if (!groups[match.date]) {
          groups[match.date] = [];
        }
        groups[match.date].push(match);
        return groups;
      },
      {}
    );

    // Convert to array of arrays and sort matches within each group
    const matchesArray = Object.values(groupedMatches).map((matches) =>
      matches.sort((a, b) => {
        // First sort by time
        const timeComparison = a.time.localeCompare(b.time);
        if (timeComparison !== 0) return timeComparison;

        // If times are equal, sort by game_location_id
        return (
          a.game_location.game_location_id - b.game_location.game_location_id
        );
      })
    );

    // Sort groups by date
    matchesArray.sort((a, b) => a[0].date.localeCompare(b[0].date));

    return matchesArray;
  }

  return (
    <div ref={tableRef}>
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
        <Table.Header
          ref={headerRef}
          style={{
            position: isSticky ? "fixed" : "relative",
            top: isSticky ? 0 : "auto", // Adjust based on your nav height
            backgroundColor: "var(--color-background)",
            zIndex: 10,
            borderBottom: "1px solid var(--gray-5)",
            width: isSticky ? tableRef.current?.offsetWidth : "auto",
            visibility: isSticky ? "visible" : "visible",
            display: "table-header-group",
            boxShadow: isSticky ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <Table.Row>
            <Table.ColumnHeaderCell
              style={{ cursor: "pointer" }}
              onClick={() => updateGrouping("time")}
            >
              Time
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 1</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Participant 2</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{ cursor: "pointer" }}
              onClick={() => updateGrouping("date")}
            >
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{ cursor: "pointer" }}
              onClick={() => updateGrouping("field")}
            >
              Location
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {/* Add placeholder when header is sticky to prevent content jump */}
        {isSticky && (
          <Table.Header style={{ visibility: "hidden" }}>
            <Table.Row>
              <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Participant 1</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Participant 2</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
        )}

        <Table.Body>
          <MatchScheduleTable matches={filteredMatches} />
        </Table.Body>
      </Table.Root>
    </div>
  );
}
