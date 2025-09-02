import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

import { Colors } from "../constants/colors";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onPress, icon, disabled }) => {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [styles.buttonInnerContainer, styles.pressed, disabled && styles.disabled]
          : [styles.buttonInnerContainer, disabled && styles.disabled]
      }
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: Colors.primaryRed }}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
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
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#999",
  },
  iconContainer: {
    marginRight: 8,
  }
});
