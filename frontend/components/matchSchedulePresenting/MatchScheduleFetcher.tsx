import { test } from "@/utils/API";
import { MatchOverviewDTO } from "@/utils/types";
import { MatchScheduleFiltering } from "./MatchScheduleFiltering";

/**
 * A component that fetches match data and prepares it for presentation
 * @returns a componennt that contains filters and a table of matches
 */
export async function MatchScheduleFetcher() {
  const data = await test();

  // Group matches by time
  const groupedMatches = data.reduce(
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

  // Sort matches within each group by game_location_id and convert to array format
  const matchesArray = Object.entries(groupedMatches).map(
    ([timeKey, matches]) => {
      return {
        timeKey,
        matches: matches.sort(
          (a, b) =>
            a.game_location.game_location_id - b.game_location.game_location_id
        ),
      };
    }
  );

  // Sort by date and time
  matchesArray.sort((a, b) => a.timeKey.localeCompare(b.timeKey));

  return <MatchScheduleFiltering matches={matchesArray} />;
}
