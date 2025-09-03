import { Platform, Linking } from "react-native";

/**
 * Opens a location in a map app with OpenStreetMap as the preferred option
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @param label Optional label for the location
 */
export function openLocationInMaps(
  latitude: number,
  longitude: number,
  label: string = "Location"
) {
  // Use the new improved function
  openLocation({
    coords: { latitude, longitude },
    title: label,
    preferOsm: true,
  }).catch((error) => {
    console.error("Failed to open map:", error);
  });
}

/**
 * Open a location in the most appropriate map app
 * @param options Options for opening the location
 * @returns Promise that resolves when a map app is opened
 */
export async function openLocation({
  coords,
  address,
  title,
  preferOsm = true,
}: {
  coords?: { latitude: number; longitude: number } | null;
  address?: string;
  title?: string;
  preferOsm?: boolean;
}): Promise<boolean> {
  const label = encodeURIComponent(title || "Location");
  const encodedAddress = address ? encodeURIComponent(address) : "";

  const availableApps = [];

  // Define URL schemes for different map apps
  if (coords) {
    const { latitude, longitude } = coords;

    // OpenStreetMap native app
    if (preferOsm) {
      availableApps.push({
        name: "OpenStreetMap App",
        url: `org.openstreetmap.app://map?center=${latitude},${longitude}&zoom=17&title=${label}`,
      });
    }

    // Platform specific map apps
    if (Platform.OS === "ios") {
      availableApps.push({
        name: "Apple Maps",
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`,
      });
      availableApps.push({
        name: "Google Maps iOS",
        url: `comgooglemaps://?daddr=${latitude},${longitude}&q=${label}&directionsmode=driving`,
      });
    } else if (Platform.OS === "android") {
      availableApps.push({
        name: "Google Maps",
        url: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
      });
    }

    // Web fallbacks (last resort)
    availableApps.push({
      name: "OpenStreetMap Web",
      url: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=16`,
    });
    availableApps.push({
      name: "Google Maps Web",
      url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });
  } else if (encodedAddress) {
    // Address-based searches
    if (Platform.OS === "ios") {
      availableApps.push({
        name: "Apple Maps",
        url: `http://maps.apple.com/?q=${encodedAddress}`,
      });
      availableApps.push({
        name: "Google Maps iOS",
        url: `comgooglemaps://?q=${encodedAddress}&directionsmode=driving`,
      });
    } else if (Platform.OS === "android") {
      availableApps.push({
        name: "Google Maps",
        url: `geo:0,0?q=${encodedAddress}`,
      });
    }

    // Web fallbacks
    availableApps.push({
      name: "OpenStreetMap Web",
      url: `https://www.openstreetmap.org/search?query=${encodedAddress}`,
    });
    availableApps.push({
      name: "Google Maps Web",
      url: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    });
  } else {
    throw new Error("Either coords or address must be provided");
  }

  // Try opening each app in sequence until one works
  for (const app of availableApps) {
    try {
      const canOpen = await Linking.canOpenURL(app.url);
      if (canOpen) {
        console.log(`Opening location with ${app.name}`);
        await Linking.openURL(app.url);
        return true;
      }
    } catch (e) {
      console.log(`Failed to open ${app.name}: ${e}`);
    }
  }

  // If we get here, none of the apps could be opened
  return false;
}
