import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { Colors } from "../constants/colors";
import api from "../api/services";
import { EventOnEvent } from "../types/event";
import EventCard from "../components/EventCard";

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

function SucheScreen() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventOnEvent[]>([]);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

    type NavigationProp = NativeStackNavigationProp<
      RootStackParamList,
      "Suche"
    >;
  
    const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Fetch events and extract categories
    api.fetchEvents().then((eventsArray) => {
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
      // Extract unique categories from all events
      const categoryMap = new Map<string, string>();
      eventsArray.forEach((event) => {
        if (event.event_type) {
          Object.entries(event.event_type).forEach(([id, name]) => {
            categoryMap.set(id, name as string);
          });
        }
      });
      const categoriesList = Array.from(categoryMap.entries()).map(
        ([id, name]) => ({ label: name, value: id })
      );
      setCategories(categoriesList);
    });
  }, []);

  useEffect(() => {
    let filtered = events;

    // Only show events today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filtered = filtered.filter((e: EventOnEvent) => {
      const eventDate = new Date(e.start * 1000);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

    if (search) {
      filtered = filtered.filter(
        (e: EventOnEvent) =>
          e.name?.toLowerCase().includes(search.toLowerCase()) ||
          e.location_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      if ((date as any).start && (date as any).end) {
        // Week filter
        const start = (date as any).start;
        const end = (date as any).end;
        filtered = filtered.filter((e: EventOnEvent) => {
          const eventDate = new Date(e.start * 1000);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= start && eventDate <= end;
        });
      } else {
        // Single day filter
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        filtered = filtered.filter((e: EventOnEvent) => {
          const eventDate = new Date(e.start * 1000);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === selected.getTime();
        });
      }
    }

    if (category) {
      filtered = filtered.filter(
        (e: EventOnEvent) => e.event_type && Object.keys(e.event_type).includes(category)
      );
    }

    setFilteredEvents(filtered);
  }, [search, date, category, events]);

  // Helper to check which date filter is active
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isToday = date && !(date as any).start && !(date as any).end && new Date(date).getTime() === today.getTime();
  const isTomorrow = date && !(date as any).start && !(date as any).end && new Date(date).getTime() === tomorrow.getTime();
  const isThisWeek = date && (date as any).start && (date as any).end;

  function onPressEvent(item: EventOnEvent) {
    navigation.navigate("Veranstaltung", { event: item, from: "Suche" });
  }

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
      <Text style={styles.label}>Kategorie</Text>
      {/* <ModalSelector
        data={[
          { label: "Kategorie wählen", value: null },
          ...categories.map((category) => ({
            label: category.label,
            value: category.value,
          })),
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
        // filteredEvents.map((event) => (
        //   <View
        //     key={event.id}
        //     style={{
        //       padding: 10,
        //       borderBottomWidth: 1,
        //       borderColor: Colors.card400,
        //     }}
        //   >
        //     <Text style={{ fontWeight: "bold", color: Colors.text800 }}>
        //       {event.name}
        //     </Text>
        //     <Text style={{ color: Colors.text700 }}>{event.location_name}</Text>
        //     <Text style={{ color: Colors.text500 }}>
        //       {new Date(event.start * 1000).toLocaleDateString("de-DE")}
        //     </Text>
        //   </View>
        // ))
        <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressEvent(item)}>
            <EventCard
              // image={item.image_url}
              start={item.start}
              name={item.name}
              location={item.location_name ?? ""}
            />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
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
