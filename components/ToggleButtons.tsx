import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../constants/colors";

interface Props {
  showUpcoming: boolean;
  setShowUpcoming: (value: boolean) => void;
}

export function ToggleButtons({ showUpcoming, setShowUpcoming }: Props) {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, showUpcoming && styles.toggleActive]}
        onPress={() => setShowUpcoming(true)}
      >
        <Text
          style={[styles.toggleText, showUpcoming && styles.toggleTextActive]}
        >
          Demnächst
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, !showUpcoming && styles.toggleActive]}
        onPress={() => setShowUpcoming(false)}
      >
        <Text
          style={[styles.toggleText, !showUpcoming && styles.toggleTextActive]}
        >
          Zurückliegend
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card200,
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: "center",
    padding: 4,
    width: "80%",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: Colors.primaryRed,
  },
  toggleText: {
    color: Colors.primaryRed,
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleTextActive: {
    color: Colors.white,
  },
});
