import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { Colors } from "../constants/colors";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [styles.buttonInnerContainer, styles.pressed]
          : styles.buttonInnerContainer
      }
      onPress={onPress}
      android_ripple={{ color: Colors.primaryRed }}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonInnerContainer: {
    backgroundColor: Colors.primaryRed,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,

    borderRadius: 28,
    width: "80%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.75,
  },
});
