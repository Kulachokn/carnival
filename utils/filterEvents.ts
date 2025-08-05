import { EventOnEvent } from "../types/event";

export function filterEvents(
  events: EventOnEvent[],
  showUpcoming: boolean
): EventOnEvent[] {
  // Set today to midnight to avoid time-of-day issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => {
      const eventDate = new Date(event.start * 1000);
      eventDate.setHours(0, 0, 0, 0);
      return showUpcoming ? eventDate >= today : eventDate < today;
    })
    .sort((a, b) => {
      const aDate = new Date(a.start * 1000);
      const bDate = new Date(b.start * 1000);
      return showUpcoming
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    });
}
