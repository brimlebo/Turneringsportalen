"use client";

import { MatchOverviewDTO } from "@/utils/types";
import { MatchScheduleTable } from "./MatchScheduleTable";
import { Flex, Table } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
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
 */
export function MatchScheduleFiltering({
  matches,
}: MatchScheduleFilteringProps) {
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [headerWidth, setHeaderWidth] = useState("100%");
  const [leftOffset, setLeftOffset] = useState(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  useEffect(() => {
    const updateSticky = () => {
      if (headerRef.current && tableRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        // Make header sticky when the table's top is off the viewport
        const shouldBeSticky = tableRect.top < 0;
        setIsSticky(shouldBeSticky);

        if (shouldBeSticky) {
          setHeaderWidth(`${tableRef.current.offsetWidth}px`);
          setLeftOffset(tableRect.left);
          const firstBodyRow = tableRef.current.querySelector("tbody tr");
          if (firstBodyRow) {
            const cells = (firstBodyRow as HTMLTableRowElement).cells;
            const widths = Array.from(cells).map(
              (cell) => cell.getBoundingClientRect().width
            );
            setColumnWidths(widths);
          }
        }
      }
    };

    window.addEventListener("scroll", updateSticky);
    window.addEventListener("resize", updateSticky);
    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, []);

  // Grouping functions and state for filtered matches remain unchanged...
  const [groupedMatches, setGroupedMatches] = useState(groupByTime());
  const [filteredMatches, setFilteredMatches] =
    useState<MatchOverviewDTO[][]>(groupedMatches);

  // (Construct fields, participants, times, dates…)

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
  ).sort((a, b) =>
    a.text.localeCompare(b.text, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  const times = Array.from(new Set(matches.map((match) => match.time)))
    .sort()
    .map((time) => ({ key: time, text: time }));

  const dates = Array.from(new Set(matches.map((match) => match.date)))
    .sort()
    .map((date) => ({ key: date, text: date }));

  // Initial filter states
  const [filterStates, setFilterStates] = useState<FilterStates>({
    fields: fields.map((field) => String(field.key)),
    participants: participants.map((participant) => String(participant.key)),
    times: times.map((time) => String(time.key)),
    dates: dates.map((date) => String(date.key)),
  });

  // Filter change and MultiSelect handler functions remain unchanged
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
    const matchesArray = Object.values(groupedMatches).map((group) =>
      group.sort(
        (a, b) =>
          a.game_location.game_location_id - b.game_location.game_location_id
      )
    );
    matchesArray.sort((a, b) => {
      const timeA = `${a[0].date} ${a[0].time}`;
      const timeB = `${b[0].date} ${b[0].time}`;
      return timeA.localeCompare(timeB);
    });
    return matchesArray;
  }

  function groupByField(): MatchOverviewDTO[][] {
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
    const matchesArray = Object.values(groupedMatches).map((group) =>
      group.sort((a, b) => {
        const timeA = `${a.date} ${a.time}`;
        const timeB = `${b.date} ${b.time}`;
        return timeA.localeCompare(timeB);
      })
    );
    matchesArray.sort((a, b) =>
      a[0].game_location.name.localeCompare(b[0].game_location.name)
    );
    return matchesArray;
  }

  function groupByDate(): MatchOverviewDTO[][] {
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
    const matchesArray = Object.values(groupedMatches).map((group) =>
      group.sort((a, b) => {
        const timeComparison = a.time.localeCompare(b.time);
        if (timeComparison !== 0) return timeComparison;
        return (
          a.game_location.game_location_id - b.game_location.game_location_id
        );
      })
    );
    matchesArray.sort((a, b) => a[0].date.localeCompare(b[0].date));
    return matchesArray;
  }

  return (
    <div style={{ position: "relative" }}>
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
      <Table.Root
        ref={tableRef}
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <Table.Header
          ref={headerRef}
          style={{
            position: isSticky ? "fixed" : "static",
            top: isSticky ? 0 : "auto",
            backgroundColor: "var(--highlighter2)",
            zIndex: 999,
            boxShadow: isSticky ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
            width: isSticky ? headerWidth : "100%",
            left: isSticky ? `${leftOffset}px` : "auto",
          }}
        >
          <Table.Row>
            <Table.ColumnHeaderCell
              style={{
                cursor: "pointer",
                color: "var(--secondaryBg)",
                width:
                  isSticky && columnWidths[0] ? `${columnWidths[0]}px` : "auto",
              }}
              onClick={() => updateGrouping("time")}
            >
              Time
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{
                color: "var(--secondaryBg)",
                width:
                  isSticky && columnWidths[1] ? `${columnWidths[1]}px` : "auto",
              }}
            >
              Participant 1
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{
                color: "var(--secondaryBg)",
                width:
                  isSticky && columnWidths[2] ? `${columnWidths[2]}px` : "auto",
              }}
            >
              Participant 2
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{
                cursor: "pointer",
                color: "var(--secondaryBg)",
                width:
                  isSticky && columnWidths[3] ? `${columnWidths[3]}px` : "auto",
              }}
              onClick={() => updateGrouping("date")}
            >
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{
                cursor: "pointer",
                color: "var(--secondaryBg)",
                width:
                  isSticky && columnWidths[4] ? `${columnWidths[4]}px` : "auto",
              }}
              onClick={() => updateGrouping("field")}
            >
              Location
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {isSticky && (
          <Table.Header style={{ visibility: "hidden" }}>
            <Table.Row>
              <Table.ColumnHeaderCell style={{ width: columnWidths[0] }}>
                Time
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: columnWidths[1] }}>
                Participant 1
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: columnWidths[2] }}>
                Participant 2
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: columnWidths[3] }}>
                Date
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: columnWidths[4] }}>
                Location
              </Table.ColumnHeaderCell>
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
