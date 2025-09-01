export function groupByFirstLetter<T>(
  items: T[],
  getItemLabel: (item: T) => string
): { title: string; data: T[] }[] {
  const groups: { [letter: string]: T[] } = {};
  items.forEach((item) => {
    let label = getItemLabel(item);
    if (!label || !label[0]) return;
    // Normalize diacritics and remove quotes/apostrophes
    const normalized = label
      .normalize("NFD")
      // Remove quotes/apostrophes including German-style quotes
      .replace(/["'`“”„«»]/g, "")
      .replace(/\p{Diacritic}/gu, "") // remove diacritics (unicode)
      .replace(/[\u0300-\u036f]/g, ""); // remove diacritics (legacy)
    const letter = normalized[0].toUpperCase();
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