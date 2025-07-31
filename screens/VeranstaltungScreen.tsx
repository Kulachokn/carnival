import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";

import { Colors } from "../constants/colors";
import { RootStackParamList } from "../types/navigation";
import { EventOnEvent } from "../types/event";
import PrimaryButton from "../components/PrimaruButton";
import { InfoRow } from "../components/InfoRow";
import { InfoBox } from "../components/InfoBox";
import { EventMap } from "../components/EventMap";
import { useGeocodeAddress } from "../hooks/useGeocodeAddress";

type VeranstaltungScreenRouteProp = RouteProp<
  RootStackParamList,
  "Veranstaltung"
>;

type Props = {
  route: VeranstaltungScreenRouteProp;
};

const VeranstaltungScreen: React.FC<Props> = ({ route }) => {
  const event: EventOnEvent = route.params.event;

  const { coords, isLoading } = useGeocodeAddress(event.location_address);

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

      <EventMap
        coords={coords}
        isLoading={isLoading}
        locationName={event.location_name}
        eventName={event.name}
        onPressMapButton={openInMaps}
      />

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
