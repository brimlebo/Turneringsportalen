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
        >
          Create Schedule
        </Button>
      )}
      <Button>
        <Link
          style={{ textDecoration: "none", color: "black" }}
          href={`/tournaments/${id}/edit`}
        >
          Edit Tournament
        </Link>
      </Button>
      {!scheduleExists && (
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            href={`/tournaments/${id}/registration`}
          >
            Register
          </Link>
        </Button>
      )}
    </Flex>
  );
}
