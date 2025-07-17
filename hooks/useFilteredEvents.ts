import { useMemo } from "react";
import { EventOnEvent } from "../types/event";

interface FilterOptions {
  events: EventOnEvent[];
  search: string;
  date: Date | { start: Date; end: Date } | null;
  category: string | null;
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
  category,
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
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(searchLower) ||
          event.location_name?.toLowerCase().includes(searchLower)
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

 if (category) {
  filtered = filtered.filter(
    (event) => event.event_type && Object.keys(event.event_type).includes(category)
  );
}
   



    return filtered;
  }, [events, search, date, category]);
}