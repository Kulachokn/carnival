export function formatShortDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const day = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${day}, ${dd}.${mm}.${yy}`;
}

export function formatTimeHHMM(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTimeShort(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }) + ' · ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}