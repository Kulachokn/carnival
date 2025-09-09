import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../constants/colors";
import { OpenStreetMapTiles } from "./OpenStreetMapTiles";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";
import { KOLN_CENTER} from '../constants/knownVenues'

type Props = {
  coords: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  locationName: string;
  eventName: string;
  onPressMapButton: () => void;
};

export function EventMap({
  coords,
  isLoading,
  locationName,
  eventName,
  onPressMapButton,
}: Props) {
  const safeCoords = coords || KOLN_CENTER;
  const title = decodeHtmlEntities(locationName || eventName || "Ort unbekannt");

  return (
    <View style={styles.mapContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primaryRed} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              ...safeCoords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <OpenStreetMapTiles />
            <Marker coordinate={safeCoords} title={title} />
          </MapView>

          <Pressable style={styles.mapButtonFloating} onPress={onPressMapButton}>
            <Feather name="external-link" size={24} color={Colors.white} />
          </Pressable>

          {!coords && (
            <View style={styles.overlay}>
              <Text style={styles.mapError}>📍 Ort unbekannt – zentriert auf Köln</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: Colors.white,
    fontSize: 13,
    textAlign: "center",
  },
  mapButtonFloating: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: Colors.primaryRed,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    elevation: 2,
  },
  overlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
