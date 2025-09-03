import { Platform, Linking } from 'react-native';

/**
 * Opens location in map app with address directly when coordinates aren't available
 * @param address Street address to search for
 * @param locationName Name of the location to display
 * @param city Optional city name
 */
export function openAddressInMaps(address: string, locationName: string, city: string = 'Köln') {
  const formattedAddress = encodeURIComponent(`${address}, ${city}`);
  const encodedLabel = encodeURIComponent(locationName || 'Event Location');
  
  // URLs for different platforms
  const openStreetMapUrl = `https://www.openstreetmap.org/search?query=${formattedAddress}`;
  
  const fallbackUrl = Platform.select({
    ios: `http://maps.apple.com/?q=${formattedAddress}`,
    android: `geo:0,0?q=${formattedAddress}`,
    default: openStreetMapUrl,
  });
  
  // Try OpenStreetMap first, fallback to platform default
  Linking.canOpenURL(openStreetMapUrl)
    .then(supported => {
      if (supported) {
        return Linking.openURL(openStreetMapUrl);
      } else {
        return Linking.openURL(fallbackUrl!);
      }
    })
    .catch(() => {
      // If OpenStreetMap app is not installed or there's an error
      Linking.openURL(fallbackUrl!);
    });
}
