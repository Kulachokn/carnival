import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

interface DateQuickSelectProps {
  isToday: boolean | null;
  isTomorrow: boolean | null;
  isThisWeek: boolean | null;
  onSelectToday: () => void;
  onSelectTomorrow: () => void;
  onSelectThisWeek: () => void;
}

const DateQuickSelect: React.FC<DateQuickSelectProps> = ({
  isToday,
  isTomorrow,
  isThisWeek,
  onSelectToday,
  onSelectTomorrow,
  onSelectThisWeek,
}) => (
  <View style={styles.dateRow}>
    <TouchableOpacity
      style={[styles.dateBtn, isToday && styles.dateBtnActive]}
      onPress={onSelectToday}
    >
      <Text style={[styles.dateBtnText, isToday && styles.dateBtnTextActive]}>Heute</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.dateBtn, isTomorrow && styles.dateBtnActive]}
      onPress={onSelectTomorrow}
    >
      <Text style={[styles.dateBtnText, isTomorrow && styles.dateBtnTextActive]}>Morgen</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.dateBtn, isThisWeek && styles.dateBtnActive]}
      onPress={onSelectThisWeek}
    >
      <Text style={[styles.dateBtnText, isThisWeek && styles.dateBtnTextActive]}>Diese Woche</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dateBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.card400,
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  dateBtnActive: {
    backgroundColor: Colors.primaryRed,
    borderColor: Colors.primaryRed,
  },
  dateBtnText: {
    color: Colors.text800,
    fontWeight: "bold",
  },
  dateBtnTextActive: {
    color: Colors.white,
  },
});

export default DateQuickSelect;
