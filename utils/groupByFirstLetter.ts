export function groupByFirstLetter<T>(
  items: T[],
  getItemLabel: (item: T) => string
): { title: string; data: T[] }[] {
  const groups: { [letter: string]: T[] } = {};
  items.forEach((item) => {
    const label = getItemLabel(item);
    const letter = label[0]?.toUpperCase() || "#";
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

// export function groupByFirstLetter<T extends { name: string }>(items: T[]) {
//   const groups: { title: string; data: T[] }[] = [];
//   const grouped: { [key: string]: T[] } = {};

//   items.forEach((item) => {
//        if (!item.name || typeof item.name !== "string" || item.name.length === 0) {
//       return; // skip items with no valid name
//     }
//     const letter = item.name[0].toUpperCase();
//     if (!grouped[letter]) grouped[letter] = [];
//     grouped[letter].push(item);
//   });

//   Object.keys(grouped)
//     .sort()
//     .forEach((letter) => {
//       groups.push({ title: letter, data: grouped[letter] });
//     });

//   return groups;
// }