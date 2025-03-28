"use client";

import { createMatchSchedule } from "@/utils/API";
import { Button, Flex, Link } from "@radix-ui/themes";

type TournamentViewButtonAreaProps = {
  id: number;
};

export default function TournamentViewButtonArea({
  id,
}: TournamentViewButtonAreaProps) {
  function handleScheduleClick() {
    createMatchSchedule(id);
  }
  return (
    <Flex gap="2">
      <Button onClick={() => handleScheduleClick()}>Create Schedule</Button>
      <Button>
        <Link
          style={{ textDecoration: "none", color: "black" }}
          href={`/tournaments/${id}/edit`}
        >
          Edit Tournament
        </Link>
      </Button>
      <Button>
        <Link
          style={{ textDecoration: "none", color: "black" }}
          href={`/tournaments/${id}/registration`}
        >
          Register
        </Link>
      </Button>
    </Flex>
  );
}
