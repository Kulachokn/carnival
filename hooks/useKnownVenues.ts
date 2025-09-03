import { useEffect, useState } from 'react';

// Known location coordinates for venues that might be hard to geocode
const KNOWN_VENUES: Record<string, { latitude: number; longitude: number }> = {
  "Gut Clarenhof 6": { latitude: 50.9661, longitude: 6.8790 },
  "Gut Clarenhof": { latitude: 50.9661, longitude: 6.8790 },
  "Schanzenstraße 6-20 (Gebäude 3.12)": { latitude: 50.9512, longitude: 6.9157 },
  "Schanzenstraße 6-20": { latitude: 50.9512, longitude: 6.9157 },
  // Add more venues as needed
};

export function useKnownVenues(locationName: string) {
  const [venue, setVenue] = useState<{ latitude: number; longitude: number } | null>(null);
  
  useEffect(() => {
    // Check if we have a direct match
    if (KNOWN_VENUES[locationName]) {
      setVenue(KNOWN_VENUES[locationName]);
      return;
    }
    
    // Check for partial matches (e.g. if address has extra details)
    for (const knownVenue in KNOWN_VENUES) {
      if (locationName.includes(knownVenue) || knownVenue.includes(locationName)) {
        setVenue(KNOWN_VENUES[knownVenue]);
        console.log(`Found partial match for venue: ${locationName} → ${knownVenue}`);
        return;
      }
    }
    
    setVenue(null);
  }, [locationName]);
  
  return venue;
}
