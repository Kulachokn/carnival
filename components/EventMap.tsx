import React from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../constants/colors";

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
  return (
    <View style={styles.mapContainer}>
      {isLoading ? (
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
              title={locationName || eventName}
            />
          </MapView>
          <Pressable style={styles.mapButtonFloating} onPress={onPressMapButton}>
            <Feather name="external-link" size={24} color={Colors.white} />
          </Pressable>
        </>
      ) : (
        <Text style={styles.mapError}>Adresse nicht gefunden</Text>
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
    color: Colors.text500,
    fontSize: 14,
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
});