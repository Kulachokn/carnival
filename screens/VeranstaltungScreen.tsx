import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Feather from "@expo/vector-icons/Feather";

import { Colors } from "../constants/colors";
import { RootStackParamList } from "../types/navigation";
import { EventOnEvent } from "../types/event";
import PrimaryButton from "../components/PrimaruButton";
import { InfoRow } from "../components/InfoRow";
import { InfoBox } from "../components/InfoBox";

type VeranstaltungScreenRouteProp = RouteProp<
  RootStackParamList,
  "Veranstaltung"
>;

type Props = {
  route: VeranstaltungScreenRouteProp;
};

const VeranstaltungScreen: React.FC<Props> = ({ route }) => {
  const event: EventOnEvent = route.params.event;

  const [coords, setCoords] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const fullAddress = `${event.location_address || ""}, Germany`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          fullAddress
        )}&format=json&limit=1`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "VeranstaltungApp/1.0", // required for Nominatim
          },
        });

        if (!response.ok) {
          console.warn("Geocoding failed, status code:", response.status);
          return;
        }

        const data = await response.json();

        if (data.length > 0) {
          const location = data[0];
          setCoords({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
          });
        } else {
          console.warn("Adresse nicht gefunden:", fullAddress);
        }
      } catch (error) {
        console.error("Fehler bei der Geokodierung:", error);
      } finally {
        setIsLoadingMap(false);
      }
    };

    fetchCoordinates();
  }, [event]);

  const openInMaps = () => {
    if (!coords) {
      Alert.alert("Adresse nicht gefunden");
      return;
    }

    const { latitude, longitude } = coords;
    const label = encodeURIComponent(event.location_name || "Event Location");

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    Linking.openURL(url!);
  };

  const handleBuyTickets = () => {
    if (event.learnmore_link) {
      Linking.openURL(event.learnmore_link).catch(() => {
        Alert.alert("Fehler", "Die Website konnte nicht geöffnet werden.");
      });
    } else {
      Alert.alert(
        "Keine Tickets",
        "Für diese Veranstaltung sind keine Tickets verfügbar."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>

      <View style={styles.infoCard}>
        <InfoRow event={event} />
      </View>

      <View style={styles.mapContainer}>
        {isLoadingMap ? (
          <ActivityIndicator size="large" color={Colors.primaryRed} />
        ) : coords ? (
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                ...coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={true}
              zoomEnabled={true}
              rotateEnabled={true}
              pitchEnabled={true}
            >
              <Marker
                coordinate={coords}
                title={event.location_name || event.name}
              />
            </MapView>
            <Pressable style={styles.mapButtonFloating} onPress={openInMaps}>
              <Feather
                name="external-link"
                size={24}
                color={Colors.primaryRed}
              />
            </Pressable>
          </>
        ) : (
          <Text style={styles.mapError}>Adresse nicht gefunden</Text>
        )}
      </View>

      <View style={styles.btnContainer}>
        <PrimaryButton onPress={handleBuyTickets}>Tickets kaufen</PrimaryButton>
      </View>

      <View style={styles.adContainer}>
        <Text style={styles.adText}>Werbung</Text>
      </View>

      <InfoBox event={event} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text800,
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: Colors.card100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: "hidden",
    height: 180,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapError: {
    color: Colors.text500,
    fontSize: 14,
  },
  mapButtonFloating: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    elevation: 2,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  adContainer: {
    backgroundColor: Colors.card200,
    borderRadius: 12,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  adText: {
    color: Colors.text500,
    fontSize: 16,
  },
});

export default VeranstaltungScreen;
