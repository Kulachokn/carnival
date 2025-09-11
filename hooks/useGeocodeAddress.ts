import { useEffect, useState, useCallback } from "react";
import { KOLN_CENTER } from "../constants/knownVenues";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Photon API */
async function geocodeWithPhoton(address: string) {
  try {
    let query = address;
    if (
      !query.toLowerCase().includes("köln") &&
      !query.toLowerCase().includes("cologne")
    ) {
      query += ", Köln, Germany";
    } else if (!query.toLowerCase().includes("germany")) {
      query += ", Germany";
    }
    query = query.replace(/(\d+)-(\d+)/, "$1");

    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=de`
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.features?.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { latitude: lat, longitude: lon };
    }
    return null;
  } catch {
    return null;
  }
}

/** Nominatim API */
async function geocodeWithNominatim(address: string) {
  try {
    let query = address;
    if (
      !query.toLowerCase().includes("köln") &&
      !query.toLowerCase().includes("cologne")
    ) {
      query += ", Köln";
    }
    query += ", Germany";

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent":
            "CarnivalApp/1.0 (https://example.com; contact@example.com)",
          "Accept-Language": "de",
        },
      }
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Hook for geocoding an address */
export function useGeocodeAddress(address: string) {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const geocodeAddress = useCallback(async (addr: string) => {
    if (!addr || addr.trim() === "") return null;

    // Try Photon first
    const photonResult = await geocodeWithPhoton(addr);
    if (photonResult) return photonResult;

    // Fallback: Nominatim
    await delay(1000); // to avoid rate limiting
    const nominatimResult = await geocodeWithNominatim(addr);
    if (nominatimResult) return nominatimResult;

    // Default fallback: Köln center
    return KOLN_CENTER;
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      try {
        const result = await geocodeAddress(address);
        if (mounted) setCoords(result);
      } catch {
        if (mounted) setCoords(KOLN_CENTER);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [address, geocodeAddress]);

  return { coords, isLoading };
}
