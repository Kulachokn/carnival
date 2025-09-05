// Known location coordinates for venues that might be hard to geocode
export const KNOWN_VENUES: Record<string, { latitude: number; longitude: number }> = {
  "Gut Clarenhof 6": { latitude: 50.9661, longitude: 6.8790 },
  "Gut Clarenhof": { latitude: 50.9661, longitude: 6.8790 },
  "Schanzenstraße 6-20 (Gebäude 3.12)": { latitude: 50.9512, longitude: 6.9157 },
  "Schanzenstraße 6-20": { latitude: 50.9512, longitude: 6.9157 },
  "Markmanngasse 13-15": { latitude: 50.9360, longitude: 6.9570 }, // Approximate coordinates for Köln
  // Add more venues as needed
};

// Fallback coordinates for Köln city center
export const KOLN_CENTER = { latitude: 50.9375, longitude: 6.9603 };
