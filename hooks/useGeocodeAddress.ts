import { useEffect, useState, useCallback } from "react";

// Known location coordinates for venues that might be hard to geocode
const KNOWN_VENUES: Record<string, { latitude: number; longitude: number }> = {
  "Gut Clarenhof 6": { latitude: 50.9661, longitude: 6.8790 },
  "Schanzenstraße 6-20 (Gebäude 3.12)": { latitude: 50.9512, longitude: 6.9157 },
  "Schanzenstraße 6-20": { latitude: 50.9512, longitude: 6.9157 },
  "Markmanngasse 13-15": { latitude: 50.9360, longitude: 6.9570 }, // Approximate coordinates for Köln
  // Add more venues as needed
};

// Cache for geocoded addresses to avoid redundant API calls
const geocodeCache: Record<string, { latitude: number; longitude: number } | null> = {};

// Fallback coordinates for Köln city center
const KOLN_CENTER = { latitude: 50.9375, longitude: 6.9603 };

/**
 * Geocode using Photon API (primary service)
 */
async function geocodeWithPhoton(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // Format address for Photon
    let searchAddress = address;
    if (!searchAddress.toLowerCase().includes('köln') && 
        !searchAddress.toLowerCase().includes('cologne')) {
      searchAddress += ', Köln, Germany';
    } else if (!searchAddress.toLowerCase().includes('germany')) {
      searchAddress += ', Germany';
    }

    // Handle address ranges (like 13-15) which can be problematic
    searchAddress = searchAddress.replace(/(\d+)-(\d+)/, '$1');

    // Photon API call
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchAddress)}&limit=1&lang=de`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Photon geocoding request failed');
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry.coordinates;
      // Photon returns [longitude, latitude] so we need to swap them
      const result = {
        latitude: coordinates[1],
        longitude: coordinates[0]
      };
      console.log(`Photon geocoded ${address} to:`, result.latitude, result.longitude);
      return result;
    }
    
    return null;
  } catch (error) {
    console.error("Photon geocoding error:", error);
    return null;
  }
}

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
    
    try {
      // STEP 1: Try with Photon API first (primary service)
      const photonResult = await geocodeWithPhoton(addressToGeocode);
      
      if (photonResult) {
        // Cache the result
        geocodeCache[addressToGeocode] = photonResult;
        return photonResult;
      }
      
      // If Photon fails, log and try Nominatim as fallback
      console.log(`Photon failed to geocode ${addressToGeocode}, trying Nominatim...`);
      
      // STEP 2: Fallback to Nominatim (OpenStreetMap)
      // Prepare address for Nominatim
      let fullAddress = addressToGeocode;
      if (!fullAddress.toLowerCase().includes('köln') && 
          !fullAddress.toLowerCase().includes('cologne')) {
        fullAddress += ', Köln';
      }
      fullAddress += ', Germany';

      // First try with the full address
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: { 
          "User-Agent": "VeranstaltungApp/1.0",
          "Accept-Language": "de" // Prefer German results
        },
      });
      
      if (!response.ok) throw new Error('Nominatim geocoding request failed');
      
      const data = await response.json();
      
      if (data.length > 0) {
        const result = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        // Cache the result
        geocodeCache[addressToGeocode] = result;
        console.log(`Nominatim geocoded ${addressToGeocode} to:`, data[0].lat, data[0].lon, data[0].display_name);
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
          console.log(`Nominatim geocoded ${streetOnly}, Köln to:`, cityData[0].lat, cityData[0].lon, cityData[0].display_name);
          return result;
        }
      }
      
      // If we still have no results with either service, use the fallback
      console.log(`All geocoding attempts failed for ${addressToGeocode}, using Köln city center`);
      geocodeCache[addressToGeocode] = KOLN_CENTER;
      return KOLN_CENTER;
      
    } catch (error) {
      console.error("Geocoding error:", error);
      // Use Köln center as fallback in case of error
      return KOLN_CENTER;
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
          // Use Köln center as fallback in case of complete failure
          setCoords(KOLN_CENTER);
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
