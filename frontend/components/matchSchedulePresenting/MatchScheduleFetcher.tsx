import { test } from "@/utils/API";
import { MatchOverviewDTO } from "@/utils/types";
import { MatchScheduleFiltering } from "./MatchScheduleFiltering";

/**
 * A component that fetches match data and prepares it for presentation
 * @returns a componennt that contains filters and a table of matches
 */
export async function MatchScheduleFetcher() {
  const data = await test();

  return <MatchScheduleFiltering matches={data} />;
}
