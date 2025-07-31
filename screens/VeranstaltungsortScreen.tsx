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

import { RootStackParamList } from "../types/navigation";
import { Colors } from "../constants/colors";
import { EventMap } from "../components/EventMap";
import { useGeocodeAddress } from "../hooks/useGeocodeAddress";

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
    Alert.alert("Adresse kopiert");
  };

  const handleOpenWebsite = () => {
    if (ort.link) {
      Linking.openURL(ort.link);
    }
  };

  const openInMaps = () => {
    if (!coords) {
      Alert.alert("Adresse nicht gefunden");
      return;
    }

    const { latitude, longitude } = coords;
    const label = encodeURIComponent(ort.name || "Event Location");

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    Linking.openURL(url!);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.addressTitle}>{ort.name}</Text>
      <EventMap
        coords={coords}
        isLoading={isLoading}
        locationName={ort.name}
        eventName={ort.name}
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
      <Text style={styles.addressText}>{ort.address}</Text>
      <TouchableOpacity style={styles.websiteBtn} onPress={handleOpenWebsite}>
        <Text style={styles.websiteBtnText}>Website des Veranstalters</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.routeBtn} onPress={handleRoute}>
        <Text style={styles.routeBtnText}>Route berechnen</Text>
        <Feather name="external-link" size={18} color={Colors.text800} style={{ marginLeft: 8 }} />
      </TouchableOpacity> */}
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
  // routeBtn: {
  //   backgroundColor: Colors.card200,
  //   borderRadius: 24,
  //   paddingVertical: 12,
  //   alignItems: "center",
  //   flexDirection: "row",
  //   justifyContent: "center",
  // },
  // routeBtnText: {
  //   color: Colors.text800,
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
});

export default VeranstaltungsortScreen;
