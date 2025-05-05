"use client";

import { createMatchSchedule } from "@/utils/API";
import { Button, Flex, Link } from "@radix-ui/themes";
import { useState } from "react";

type TournamentViewButtonAreaProps = {
  id: number;
  scheduleExists: boolean;
};

export default function TournamentViewButtonArea({
  id,
  scheduleExists,
}: TournamentViewButtonAreaProps) {
  const [scheduleClicked, setScheduleClicked] = useState(false);

  function handleScheduleClick() {
    setScheduleClicked(true);
    console.log("Creating schedule for tournament: ", id);
    createMatchSchedule(id);
  }
  return (
    <Flex gap="2">
      {!scheduleExists && (
        <Button
          disabled={scheduleClicked}
          onClick={() => handleScheduleClick()}
          style={{
            color: "var(--text-color)",
            backgroundColor: "var(--highlighter3)",
          }}
        >
          Create Schedule
        </Button>
      )}
      <Button
        style={{
          color: "var(--text-color)",
          backgroundColor: "var(--highlighter3)",
        }}
      >
        <Link
          style={{ textDecoration: "none" }}
          href={`/tournaments/${id}/edit`}
        >
          Edit Tournament
        </Link>
      </Button>
      {!scheduleExists && (
        <Button
          style={{
            color: "var(--text-color)",
            backgroundColor: "var(--highlighter3)",
          }}
        >
          <Link
            style={{ textDecoration: "none" }}
            href={`/tournaments/${id}/registration`}
          >
            Register
          </Link>
        </Button>
      )}
    </Flex>
  );
}
