// Known location coordinates for venues that might be hard to geocode
export const KNOWN_VENUES: Record<string, { latitude: number; longitude: number }> = {
  // Previously added venues
  "Gut Clarenhof 6": { latitude: 50.9661, longitude: 6.8790 },
  "Gut Clarenhof": { latitude: 50.9661, longitude: 6.8790 },
  "Schanzenstraße 6-20 (Gebäude 3.12)": { latitude: 50.9512, longitude: 6.9157 },
  "Schanzenstraße 6-20": { latitude: 50.9512, longitude: 6.9157 },
  "Markmanngasse 13-15": { latitude: 50.9360, longitude: 6.9570 }, // Altstadtkneipe
  
  // New venues from events
  "KD Anlegestelle Frankenwerft": { latitude: 50.9394, longitude: 6.9629 }, // Partyschiff dock location
  "Albin-Köbis-Str. 13": { latitude: 50.8735, longitude: 7.0502 }, // Premio Reifen location
  "Girlitzweg 30": { latitude: 50.9342, longitude: 6.9638 }, // Halle Tor 2
  "Rheinparkweg 1": { latitude: 50.9469, longitude: 6.9799 }, // Theater am Tanzbrunnen
  
  // Common problematic venues with special characters
  "Overstolzenstr. & Rheinuferpromenade": { latitude: 50.9378, longitude: 6.9610 },
  "An St. Severin": { latitude: 50.9315, longitude: 6.9564 },
  "Apostelnstr. 11": { latitude: 50.9363, longitude: 6.9435 },
  "Chlodwigplatz/Severinstr.": { latitude: 50.9227, longitude: 6.9587 },
  "KD-Anleger": { latitude: 50.9394, longitude: 6.9629 },
  "Rheinterrassen/Tanzbrunnen": { latitude: 50.9469, longitude: 6.9799 },
  
  // Special events with unknown or changing locations
  "Vorverkauf Stunksitzung": { latitude: 50.9363, longitude: 6.9435 },
  "": { latitude: 50.9375, longitude: 6.9603 }, // Empty address fallback
  
  // WDR venues and events
  "Wallrafplatz 5": { latitude: 50.9399, longitude: 6.9564 },
  "Wallrafplatz 5, 50667 Köln": { latitude: 50.9399, longitude: 6.9564 },
  "WDR 4 Sessionseröffnung": { latitude: 50.9399, longitude: 6.9564 },
  "WDR 4 Sessionseröffnung 2025": { latitude: 50.9399, longitude: 6.9564 },
  "WDR 4 Sessionseröffnung 2025 \"Immer wieder neue Lieder\"": { latitude: 50.9399, longitude: 6.9564 },
  "Immer wieder neue Lieder": { latitude: 50.9399, longitude: 6.9564 },
  "WDR 4 Sessionseröffnung 2025 Immer wieder neue Lieder": { latitude: 50.9399, longitude: 6.9564 },
};

// Fallback coordinates for Köln city center
export const KOLN_CENTER = { latitude: 50.9375, longitude: 6.9603 };
