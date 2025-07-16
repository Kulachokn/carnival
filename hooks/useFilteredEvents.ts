import { useMemo } from "react";
import { EventOnEvent } from "../types/event";

interface FilterOptions {
  events: EventOnEvent[];
  search: string;
  date: Date | { start: Date; end: Date } | null;
//   categories: string | null;
    categories: { label: string; value: string }[] | null;
}

function isDateRange(
  date: Date | { start: Date; end: Date }
): date is { start: Date; end: Date } {
  return typeof date === "object" && "start" in date && "end" in date;
}

export default function useFilteredEvents({
  events,
  search,
  date,
  categories,
}: FilterOptions): EventOnEvent[] {
  return useMemo(() => {
    let filtered = [...events];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered = filtered.filter((e) => {
      const eventDate = new Date(e.start * 1000);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name?.toLowerCase().includes(s) ||
          e.location_name?.toLowerCase().includes(s)
      );
    }

    if (date) {
      if (isDateRange(date)) {
        const { start, end } = date;
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.start * 1000);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= start && eventDate <= end;
        });
      } else {
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.start * 1000);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === selected.getTime();
        });
      }
    }

    if (categories && categories.length > 0) {}
    console.log(categories);
    // if (categories && categories.length > 0) {
//   const selectedIds = categories.map(c => c.value);
//   filtered = filtered.filter((e) =>
//     e.event_type && Object.keys(e.event_type).some(id => selectedIds.includes(id))
//   );
// }


    return filtered;
  }, [events, search, date, categories]);
}