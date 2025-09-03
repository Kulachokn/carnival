import { useEffect, useState, useCallback } from "react";

// Known location coordinates for venues that might be hard to geocode
const KNOWN_VENUES: Record<string, { latitude: number; longitude: number }> = {
  "Gut Clarenhof 6": { latitude: 50.9661, longitude: 6.8790 },
  "Gut Clarenhof": { latitude: 50.9661, longitude: 6.8790 },
  "Schanzenstraße 6-20 (Gebäude 3.12)": { latitude: 50.9512, longitude: 6.9157 },
  "Schanzenstraße 6-20": { latitude: 50.9512, longitude: 6.9157 },
  // Add more venues as needed
};

// Cache for geocoded addresses to avoid redundant API calls
const geocodeCache: Record<string, { latitude: number; longitude: number } | null> = {};

export function useGeocodeAddress(address: string) {
  const [coords, setCoords] = useState<null | { latitude: number; longitude: number }>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the geocoding function to avoid recreating it on each render
  const geocodeAddress = useCallback(async (addressToGeocode: string) => {
    // Check cache first
    if (geocodeCache[addressToGeocode] !== undefined) {
      return geocodeCache[addressToGeocode];
    }
    
    // Check if it's a known venue first
    if (KNOWN_VENUES[addressToGeocode]) {
      const knownCoords = KNOWN_VENUES[addressToGeocode];
      console.log(`Using known coordinates for ${addressToGeocode}:`, knownCoords.latitude, knownCoords.longitude);
      geocodeCache[addressToGeocode] = knownCoords;
      return knownCoords;
    }
    
    // Try partial matches for known venues
    for (const venue in KNOWN_VENUES) {
      if (addressToGeocode.includes(venue) || venue.includes(addressToGeocode)) {
        const knownCoords = KNOWN_VENUES[venue];
        console.log(`Found partial venue match: ${addressToGeocode} → ${venue}`);
        geocodeCache[addressToGeocode] = knownCoords;
        return knownCoords;
      }
    }
    
    // Prepare address for geocoding
    let fullAddress = addressToGeocode;
    if (!fullAddress.toLowerCase().includes('köln') && 
        !fullAddress.toLowerCase().includes('cologne')) {
      fullAddress += ', Köln';
    }
    fullAddress += ', Germany';

    try {
      // First try with the full address
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: { 
          "User-Agent": "VeranstaltungApp/1.0",
          "Accept-Language": "de" // Prefer German results
        },
      });
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      
      if (data.length > 0) {
        const result = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        // Cache the result
        geocodeCache[addressToGeocode] = result;
        console.log(`Geocoded ${addressToGeocode} to:`, data[0].lat, data[0].lon, data[0].display_name);
        return result;
      }
      
      // If no results, try with just the street name for better matching
      const streetOnly = addressToGeocode.split(',')[0];
      const cityUrl = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(streetOnly)}&city=Köln&country=Germany&format=json&limit=1`;
      
      const cityResponse = await fetch(cityUrl, {
        headers: { 
          "User-Agent": "VeranstaltungApp/1.0",
          "Accept-Language": "de"
        },
      });
      
      if (cityResponse.ok) {
        const cityData = await cityResponse.json();
        if (cityData.length > 0) {
          const result = {
            latitude: parseFloat(cityData[0].lat),
            longitude: parseFloat(cityData[0].lon),
          };
          // Cache the result
          geocodeCache[addressToGeocode] = result;
          console.log(`Geocoded ${streetOnly}, Köln to:`, cityData[0].lat, cityData[0].lon, cityData[0].display_name);
          return result;
        }
      }
      
      // If we still have no results, try with a more structured approach for addresses that might have special formats
      // Some addresses may have building numbers or additional details that confuse the geocoder
      const structuredAddressUrl = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(streetOnly)}&city=Köln&format=json&addressdetails=1&limit=1`;
      
      const structuredResponse = await fetch(structuredAddressUrl, {
        headers: { 
          "User-Agent": "VeranstaltungApp/1.0",
          "Accept-Language": "de"
        },
      });
      
      if (structuredResponse.ok) {
        const structuredData = await structuredResponse.json();
        if (structuredData.length > 0) {
          const result = {
            latitude: parseFloat(structuredData[0].lat),
            longitude: parseFloat(structuredData[0].lon),
          };
          // Cache the result
          geocodeCache[addressToGeocode] = result;
          console.log(`Geocoded with structured approach:`, structuredData[0].lat, structuredData[0].lon, structuredData[0].display_name);
          return result;
        }
      }
      
      // Specially handle "Gut" addresses which are often estates/farms with specific locations
      if (addressToGeocode.toLowerCase().includes('gut')) {
        try {
          // Try wider area search
          const gutSearchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressToGeocode)}&viewbox=6.7,50.8,7.2,51.1&bounded=1&format=json&limit=1`;
          
          const gutResponse = await fetch(gutSearchUrl, {
            headers: { 
              "User-Agent": "VeranstaltungApp/1.0",
              "Accept-Language": "de"
            },
          });
          
          if (gutResponse.ok) {
            const gutData = await gutResponse.json();
            if (gutData.length > 0) {
              const result = {
                latitude: parseFloat(gutData[0].lat),
                longitude: parseFloat(gutData[0].lon),
              };
              // Cache the result
              geocodeCache[addressToGeocode] = result;
              console.log(`Geocoded estate address:`, gutData[0].lat, gutData[0].lon, gutData[0].display_name);
              return result;
            }
          }
          
          // If still no result, try a hardcoded value for this specific address
          if (addressToGeocode === "Gut Clarenhof 6") {
            // This is an approximate location for Gut Clarenhof near Köln
            const hardcodedResult = {
              latitude: 50.9661,
              longitude: 6.8790
            };
            geocodeCache[addressToGeocode] = hardcodedResult;
            console.log(`Using hardcoded location for Gut Clarenhof 6`);
            return hardcodedResult;
          }
        } catch (gutError) {
          console.error("Error geocoding estate address:", gutError);
        }
      }
      
      // No results found with any method
      console.log(`Failed to geocode ${addressToGeocode}`);
      geocodeCache[addressToGeocode] = null;
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!address) {
      setCoords(null);
      setIsLoading(false);
      return;
    }
    
    let isMounted = true;
    
    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        const result = await geocodeAddress(address);
        if (isMounted) {
          setCoords(result);
        }
      } catch (error) {
        console.error("Error in useGeocodeAddress:", error);
        if (isMounted) {
          setCoords(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCoordinates();
    
    // Clean up function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [address, geocodeAddress]);

  return { coords, isLoading };
}
