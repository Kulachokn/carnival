import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { Colors } from "../constants/colors";

interface Props {
  showUpcoming: boolean;
  setShowUpcoming: (value: boolean) => void;
}

export function ToggleButtons({ showUpcoming, setShowUpcoming }: Props) {
  const translateX = useRef(new Animated.Value(showUpcoming ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: showUpcoming ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showUpcoming]);

  // Interpolate pill position
  const pillPosition = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 160], // left padding to halfway (assuming container width is ~320px)
  });

  return (
    <View style={styles.toggleContainer}>
      <Animated.View
        style={[
          styles.pill,
          {
            left: pillPosition,
          },
        ]}
      />
      <TouchableOpacity
        style={styles.segment}
        onPress={() => setShowUpcoming(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentText,
            showUpcoming && styles.segmentTextActive,
          ]}
        >
          Demnächst
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.segment}
        onPress={() => setShowUpcoming(false)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentText,
            !showUpcoming && styles.segmentTextActive,
          ]}
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
    position: "relative",
    overflow: "hidden",
  },
  pill: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: "48%",
    backgroundColor: Colors.primaryRed,
    borderRadius: 20,
    zIndex: 0,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 1,
  },
  segmentText: {
    color: Colors.primaryRed,
    fontWeight: "bold",
    fontSize: 16,
  },
  segmentTextActive: {
    color: Colors.white,
  },
});