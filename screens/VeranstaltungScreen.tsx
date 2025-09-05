import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  Alert,
  Image,
} from "react-native";
import { openLocationInMaps } from "../utils/mapHelpers";
import { openAddressInMaps } from "../utils/mapAddressHelper";
import { RouteProp } from "@react-navigation/native";

import { Colors } from "../constants/colors";
import { RootStackParamList } from "../types/navigation";
import { EventOnEvent } from "../types/event";
import PrimaryButton from "../components/PrimaruButton";
import { InfoRow } from "../components/InfoRow";
import { InfoBox } from "../components/InfoBox";
import { EventMap } from "../components/EventMap";
import { useGeocodeAddress } from "../hooks/useGeocodeAddress";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useDataContext } from "../context/DataContext";

import { AddToCalendarButton } from "../components/AddToCalendarButton";

type VeranstaltungScreenRouteProp = RouteProp<
  RootStackParamList,
  "Veranstaltung"
>;

type Props = {
  route: VeranstaltungScreenRouteProp;
};

const VeranstaltungScreen: React.FC<Props> = ({ route }) => {
  const event: EventOnEvent = route.params.event;

  const { banners } = useDataContext();
  const bannerForEvent =
    banners.details && banners.details.length > 0
      ? banners.details[Math.floor(Math.random() * banners.details.length)]
      : undefined;

  const { coords, isLoading } = useGeocodeAddress(event.location_address);

  const openInMaps = () => {
    if (coords) {
      // If we have coordinates, use them
      const { latitude, longitude } = coords;
      openLocationInMaps(
        latitude,
        longitude,
        event.location_name || "Event Location"
      );
    } else if (event.location_address) {
      // If we have an address but no coordinates, try to open by address directly
      openAddressInMaps(
        event.location_address,
        event.location_name || "Event Location",
        "Köln" // Assuming most events are in Cologne/Köln
      );
    } else {
      Alert.alert(
        "Adresse nicht gefunden",
        "Keine Adressinformationen verfügbar."
      );
    }
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

      <EventMap
        coords={coords}
        isLoading={isLoading}
        locationName={event.location_name}
        eventName={event.name}
        onPressMapButton={openInMaps}
      />

      <InfoBox event={event} />

      <View style={styles.btnContainer}>
        <PrimaryButton
          onPress={handleBuyTickets}
          icon={<Ionicons name="ticket" size={24} color="white" />}
        >
          Tickets kaufen
        </PrimaryButton>
      </View>

      <View style={styles.btnContainer}>
        <AddToCalendarButton event={event} />
      </View>

      <View style={styles.imgContainer}>
        {bannerForEvent && bannerForEvent.acf && (
          <Image
            source={{ uri: bannerForEvent.acf.banner_image_url }}
            style={styles.image}
          />
        )}
      </View>
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
  imgContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "stretch",
  },
});

export default VeranstaltungScreen;
