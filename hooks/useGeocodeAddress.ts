import { useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KNOWN_VENUES, KOLN_CENTER } from "../constants/knownVenues";

// In-memory cache
const geocodeCache: Record<string, { latitude: number; longitude: number } | null> = {};
const GEOCODE_CACHE_KEY = "geocoding_cache_v1";

// Debounced save handler
let saveTimeout: NodeJS.Timeout | null = null;
async function saveCacheDebounced() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await AsyncStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(geocodeCache));
    } catch (err) {
      console.error("Failed to save geocoding cache:", err);
    }
  }, 2000);
}

// Load cache once
async function loadCache() {
  try {
    const storedCache = await AsyncStorage.getItem(GEOCODE_CACHE_KEY);
    if (storedCache) {
      Object.assign(geocodeCache, JSON.parse(storedCache));
    }
  } catch (err) {
    console.error("Failed to load geocoding cache:", err);
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Photon API */
async function geocodeWithPhoton(address: string) {
  try {
    let query = address;
    if (!query.toLowerCase().includes("köln") && !query.toLowerCase().includes("cologne")) {
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
    if (!query.toLowerCase().includes("köln") && !query.toLowerCase().includes("cologne")) {
      query += ", Köln";
    }
    query += ", Germany";

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "CarnivalApp/1.0 (https://example.com; contact@example.com)",
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

export function useGeocodeAddress(address: string) {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cacheLoaded = useRef(false);
  useEffect(() => {
    if (!cacheLoaded.current) {
      loadCache();
      cacheLoaded.current = true;
    }
  }, []);

  const geocodeAddress = useCallback(async (addr: string) => {
    if (!addr || addr.trim() === "") return null;

    // 1. Cache
    if (geocodeCache[addr] !== undefined) return geocodeCache[addr];

    // 2. Known venues (exact or partial match)
    for (const venue in KNOWN_VENUES) {
      if (addr.includes(venue) || venue.includes(addr)) {
        geocodeCache[addr] = KNOWN_VENUES[venue];
        saveCacheDebounced();
        return KNOWN_VENUES[venue];
      }
    }

    // 3. Photon
    const photonResult = await geocodeWithPhoton(addr);
    if (photonResult) {
      geocodeCache[addr] = photonResult;
      saveCacheDebounced();
      return photonResult;
    }

    // 4. Nominatim (fallback)
    await delay(1000);
    const nominatimResult = await geocodeWithNominatim(addr);
    if (nominatimResult) {
      geocodeCache[addr] = nominatimResult;
      saveCacheDebounced();
      return nominatimResult;
    }

    // 5. Default: Köln center
    geocodeCache[addr] = KOLN_CENTER;
    saveCacheDebounced();
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
