import React, { useState } from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../constants/colors";
import { OpenStreetMapTiles } from "./OpenStreetMapTiles";

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
  const [mapError, setMapError] = useState(false);

  // Show loading state if we're loading
  if (isLoading) {
    return (
      <View style={styles.mapContainer}>
        <ActivityIndicator size="large" color={Colors.primaryRed} />
      </View>
    );
  }

  // Show fallback UI if we have no coordinates or if the map has an error
  if (!coords || mapError) {
    return (
      <View style={styles.mapContainer}>
        <View style={styles.noMapContainer}>
          <Text style={styles.mapError}>Karte nicht verfügbar</Text>
          <Text style={styles.addressText}>{locationName}</Text>
          <Pressable 
            style={styles.mapButton} 
            onPress={onPressMapButton}
            android_ripple={{ color: "rgba(239, 64, 48, 0.2)" }}
          >
            <Feather name="map-pin" size={18} color={Colors.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Im Kartendienst öffnen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Show map if we have coordinates
  return (
    <View style={styles.mapContainer}>
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
        <OpenStreetMapTiles />
        <Marker
          coordinate={coords}
          title={locationName || eventName}
        />
      </MapView>
      <Pressable style={styles.mapButtonFloating} onPress={onPressMapButton}>
        <Feather name="external-link" size={24} color={Colors.white} />
      </Pressable>
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
    color: Colors.text500,
    fontSize: 14,
    marginBottom: 8,
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
  noMapContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addressText: {
    color: Colors.text800,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
