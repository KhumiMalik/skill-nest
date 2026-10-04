import { Counter } from "@/components/ui/Counter";
import type { Stat } from "../types";

/** "11:1", "1,240", "96%": a stat formatted for display, without animation. */
export function formatStat(stat: Stat): string {
  return `${stat.prefix ?? ""}${stat.value.toLocaleString("en-GB")}${stat.suffix ?? ""}`;
}

/** A stat's number, counting up when it scrolls into view. */
export function StatValue({ stat }: { stat: Stat }) {
  return <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />;
}
