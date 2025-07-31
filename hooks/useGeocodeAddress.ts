import { useEffect, useState } from "react";

export function useGeocodeAddress(address: string) {
  const [coords, setCoords] = useState<null | { latitude: number; longitude: number }>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setCoords(null);
      setIsLoading(false);
      return;
    }
    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        const fullAddress = `${address}, Germany`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
        const response = await fetch(url, {
          headers: { "User-Agent": "VeranstaltungApp/1.0" },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data.length > 0) {
          setCoords({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        } else {
          setCoords(null);
        }
      } catch {
        setCoords(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoordinates();
  }, [address]);

  return { coords, isLoading };
}