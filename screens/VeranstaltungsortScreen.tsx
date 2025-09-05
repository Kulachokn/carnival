import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { RouteProp } from "@react-navigation/native";

import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";

import { RootStackParamList } from "../types/navigation";
import { Colors } from "../constants/colors";
import { EventMap } from "../components/EventMap";
import { useGeocodeAddress } from "../hooks/useGeocodeAddress";
import { openLocation } from "../utils/mapHelpers";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";

type VeranstaltungsortScreenRouteProp = RouteProp<
  RootStackParamList,
  "Veranstaltungsort"
>;

type Props = {
  route: VeranstaltungsortScreenRouteProp;
};

const VeranstaltungsortScreen: React.FC<Props> = ({ route }) => {
  const { ort } = route.params;

  const { coords, isLoading } = useGeocodeAddress(ort.address);

  const handleCopyAddress = () => {
    Clipboard.setStringAsync(ort.address);
    Toast.show({
      type: "success",
      text1: "Adresse kopiert",
      position: "bottom",
      visibilityTime: 1500,
    });
  };

  const handleOpenWebsite = () => {
    if (ort.link) {
      Linking.openURL(ort.link);
    }
  };

  const openInMaps = async () => {
    try {
      const success = await openLocation({
        coords: coords,
        address: ort.address,
        title: ort.name || "Event Location",
        preferOsm: true,
      });

      if (!success) {
        throw new Error("Could not open any map app");
      }
    } catch (err) {
      console.error("Error opening map:", err);
      Alert.alert("Fehler", "Die Karten-App konnte nicht geöffnet werden.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.addressTitle}>{decodeHtmlEntities(ort.name)}</Text>
      <EventMap
        coords={coords}
        isLoading={isLoading}
        locationName={decodeHtmlEntities(ort.name)}
        eventName={decodeHtmlEntities(ort.name)}
        onPressMapButton={openInMaps}
      />
      <View style={styles.addressRow}>
        <Text style={styles.addressLabel}>Address</Text>
        <TouchableOpacity onPress={handleCopyAddress}>
          <Feather
            name="copy"
            size={20}
            color={Colors.text800}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText}>{decodeHtmlEntities(ort.address)}</Text>
      <TouchableOpacity style={styles.websiteBtn} onPress={handleOpenWebsite}>
        <Text style={styles.websiteBtnText}>Website des Veranstalters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  addressTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text800,
    marginBottom: 8,
  },
  mapBox: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  mapImage: {
    width: "100%",
    height: 160,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.text800,
  },
  addressText: {
    fontSize: 16,
    color: Colors.text800,
    marginBottom: 20,
  },
  websiteBtn: {
    backgroundColor: Colors.primaryRed,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  websiteBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VeranstaltungsortScreen;
