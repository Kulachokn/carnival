export function groupByFirstLetter<T>(
  items: T[],
  getItemLabel: (item: T) => string
): { title: string; data: T[] }[] {
  const groups: { [letter: string]: T[] } = {};
  items.forEach((item) => {
    const label = getItemLabel(item);
    if (!label || !label[0]) return; 
    const letter = label[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });
  return Object.keys(groups)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groups[letter],
    }));
}