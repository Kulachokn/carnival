export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const day = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${day}, ${dd}.${mm}.${yy}`;
}

export function formatTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}