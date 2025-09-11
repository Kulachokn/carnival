import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Image,
  TouchableOpacity,
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
  // console.log(event);

  const { banners } = useDataContext();
  const bannerForEvent =
    banners.details && banners.details.length > 0
      ? banners.details[Math.floor(Math.random() * banners.details.length)]
      : undefined;

 const addressToGeocode = event.location_address || event.location_name || event.name;
  
  const { coords, isLoading } = useGeocodeAddress(addressToGeocode);
  const openInMaps = () => {
    if (coords) {
      openLocationInMaps(
        coords.latitude,
        coords.longitude,
        event.location_name || "Event Location"
      );
    } else if (event.location_address) {
      openAddressInMaps(
        event.location_address,
        event.location_name || "Event Location",
        "Köln"
      );
    } else {
      Alert.alert("Adresse nicht gefunden", "Keine Adressinformationen verfügbar.");
    }
  };

  const handleBuyTickets = () => {
    if (event.learnmore_link) {
      Linking.openURL(event.learnmore_link).catch(() => {
        Alert.alert("Fehler", "Die Website konnte nicht geöffnet werden.");
      });
    }
  };

return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>

      <View style={styles.infoCard}>
        <InfoRow event={event} openInMaps={openInMaps} />
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (bannerForEvent.acf.banner_url) {
                Linking.openURL(bannerForEvent.acf.banner_url);
              }
            }}
            disabled={!bannerForEvent.acf.banner_url}
          >
            <Image
              source={{ uri: bannerForEvent.acf.banner_image_url }}
              style={styles.image}
            />
          </TouchableOpacity>
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
  imgContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover", 
  },
});

export default VeranstaltungScreen;
