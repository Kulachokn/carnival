import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
// import ModalSelector from "react-native-modal-selector";

import { Colors } from "../constants/colors";
import { events } from "../data/events";

// Set German locale for calendar
LocaleConfig.locales["de"] = {
  monthNames: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "März",
    "Apr.",
    "Mai",
    "Juni",
    "Juli",
    "Aug.",
    "Sept.",
    "Okt.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  today: "Heute",
};
LocaleConfig.defaultLocale = "de";

// const categories = [
//   { label: "Option 1", value: "option1" },
//   { label: "Option 2", value: "option2" },
//   { label: "Option 3", value: "option3" },
// ];

function SucheScreen() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(events);

  const filterEvents = () => {
    let filtered = events;
    if (search) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      if ((date as any).start && (date as any).end) {
        // Week filter
        const start = (date as any).start;
        const end = (date as any).end;
        filtered = filtered.filter((e) => {
          const eventDate = new Date(e.date);
          return eventDate >= start && eventDate <= end;
        });
      } else {
        // Single day filter
        const d = (date as Date).toISOString().slice(0, 10);
        filtered = filtered.filter((e) => e.date.slice(0, 10) === d);
      }
    }
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    setFilteredEvents(filtered);
  };

  React.useEffect(() => {
    filterEvents();
  }, [search, date, category]);

  // Helper to check which date filter is active
  const isToday =
    date &&
    !(date as any).start &&
    !(date as any).end &&
    new Date(date).toDateString() === new Date().toDateString();
  const isTomorrow =
    date &&
    !(date as any).start &&
    !(date as any).end &&
    new Date(date).toDateString() ===
      new Date(Date.now() + 86400000).toDateString();
  const isThisWeek = date && (date as any).start && (date as any).end;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={22}
          color={Colors.text500}
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Suche"
          placeholderTextColor={Colors.text500}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <Text style={styles.label}>Datum</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateBtn, isToday && styles.dateBtnActive]}
          onPress={() => setDate(new Date())}
        >
          <Text
            style={[styles.dateBtnText, isToday && styles.dateBtnTextActive]}
          >
            Heute
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateBtn, isTomorrow && styles.dateBtnActive]}
          onPress={() => setDate(new Date(Date.now() + 86400000))}
        >
          <Text
            style={[styles.dateBtnText, isTomorrow && styles.dateBtnTextActive]}
          >
            Morgen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateBtn, isThisWeek && styles.dateBtnActive]}
          onPress={() => {
            // Calculate start and end of this week (Monday-Sunday)
            const now = new Date();
            const day = now.getDay();
            const diffToMonday = (day === 0 ? -6 : 1) - day; // Sunday=0, Monday=1
            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMonday);
            monday.setHours(0, 0, 0, 0);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59, 999);
            setDate({ start: monday, end: sunday } as any);
          }}
        >
          <Text
            style={[styles.dateBtnText, isThisWeek && styles.dateBtnTextActive]}
          >
            Diese Woche
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.chooseDateBtn}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.chooseDateBtnText}>Wähle Datum</Text>
      </TouchableOpacity>
      {isCalendarVisible && (
        <View style={styles.calendarModal}>
          <Calendar
            onDayPress={(day) => {
              setDate(new Date(day.dateString));
              setCalendarVisible(false);
            }}
            markedDates={
              date && !(date as any).start
                ? {
                    [(date as Date).toISOString().slice(0, 10)]: {
                      selected: true,
                      selectedColor: Colors.primaryRed,
                      selectedTextColor: Colors.white,
                    },
                  }
                : {}
            }
            theme={{
              backgroundColor: Colors.white,
              calendarBackground: Colors.white,
              textSectionTitleColor: Colors.text500,
              selectedDayBackgroundColor: Colors.primaryRed,
              selectedDayTextColor: Colors.white,
              todayTextColor: Colors.primaryRed,
              dayTextColor: Colors.text800,
              textDisabledColor: Colors.text500,
              monthTextColor: Colors.primaryRed,
              arrowColor: Colors.primaryRed,
              textDayFontWeight: "bold",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            enableSwipeMonths={true}
          />
          <TouchableOpacity
            style={styles.calendarCloseBtn}
            onPress={() => setCalendarVisible(false)}
          >
            <Text style={styles.calendarCloseBtnText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <Text style={styles.label}>Kategorie</Text>
      <ModalSelector
        data={[
          { label: "Kategorie wählen", value: null },
          ...categories.map((cat) => ({ label: cat.label, value: cat.value })),
        ]}
        initValue={
          category
            ? categories.find((c) => c.value === category)?.label ||
              "Kategorie wählen"
            : "Kategorie wählen"
        }
        onChange={(option: { label: string; value: string | null }) =>
          setCategory(option.value)
        }
        style={styles.modalSelector}
        initValueTextStyle={styles.modalSelectorInit}
        selectTextStyle={styles.modalSelectorText}
        optionTextStyle={styles.modalSelectorOption}
        cancelText="Abbrechen"
        cancelTextStyle={styles.modalSelectorCancel}
        backdropPressToClose={true}
      /> */}
      <Text style={styles.label}>Ergebnisse</Text>
      {filteredEvents.length === 0 ? (
        <Text style={{ color: Colors.text500, marginTop: 10 }}>
          Keine Ergebnisse gefunden.
        </Text>
      ) : (
        filteredEvents.map((event) => (
          <View
            key={event.id}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: Colors.card400,
            }}
          >
            <Text style={{ fontWeight: "bold", color: Colors.text800 }}>
              {event.title}
            </Text>
            <Text style={{ color: Colors.text700 }}>{event.location}</Text>
            <Text style={{ color: Colors.text500 }}>
              {new Date(event.date).toLocaleDateString("de-DE")}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryRed,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 18,
    marginBottom: 18,
  },
  logo: {
    width: 36,
    height: 36,
    marginLeft: 10,
    marginRight: 12,
  },
  header: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 22,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card200,
    borderRadius: 16,
    marginBottom: 18,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text800,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text800,
  },
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
  chooseDateBtn: {
    backgroundColor: Colors.primaryRed,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  chooseDateBtnText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  calendarModal: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  calendarCloseBtn: {
    marginTop: 12,
    backgroundColor: Colors.primaryRed,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  calendarCloseBtnText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  modalSelector: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.card400,
    borderRadius: 8,
    backgroundColor: Colors.card200,
  },
  modalSelectorInit: {
    color: Colors.text500,
    fontSize: 16,
    padding: 12,
  },
  modalSelectorText: {
    color: Colors.text800,
    fontSize: 16,
    padding: 12,
  },
  modalSelectorOption: {
    color: Colors.text800,
    fontSize: 16,
  },
  modalSelectorCancel: {
    color: Colors.primaryRed,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SucheScreen;
