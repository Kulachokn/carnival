import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { EventOnEvent } from "../types/event";
import { Colors } from "../constants/colors";
import api from "../api/services";
import useFilteredEvents from "../hooks/useFilteredEvents";
import CategoryDropdown from "../components/CategoryDropdown";
import EventList from "../components/EventList";
import { configureGermanCalendarLocale } from "../constants/calendarLocale";
import { formatDate } from "../utils/formatDate";
import DateQuickSelect from "../components/DateQuickSelect";
import CalendarModal from "../components/CalendarModal";

configureGermanCalendarLocale();

function SucheScreen() {
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingDate, setPendingDate] = useState<
    Date | { start: Date; end: Date } | null
  >(null);
  const [pendingCategory, setPendingCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | { start: Date; end: Date } | null>(
    null
  );
  const [category, setCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [categoriesList, setCategoriesList] = useState<
    { label: string; value: string }[]
  >([]);

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Suche">;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    api.getCachedEvents().then((eventsArray) => {
      setEvents(eventsArray ?? []);

      // Extract unique categories
      const categoryMap = new Map<string, string>();
      (eventsArray ?? []).forEach((event) => {
        if (event.event_type) {
          Object.entries(event.event_type).forEach(([id, name]) => {
            categoryMap.set(id, name as string);
          });
        }
      });

      const categoriesList = Array.from(categoryMap.entries()).map(
        ([id, name]) => ({ label: name, value: id })
      );
      setCategoriesList(categoriesList);
    });
  }, []);

  const isModified =
    search !== pendingSearch ||
    JSON.stringify(date) !== JSON.stringify(pendingDate) ||
    JSON.stringify(category) !== JSON.stringify(pendingCategory);

  const filteredEvents = useFilteredEvents({
    events,
    search,
    date,
    category: category ? category.value : null,
  });

  const handleSearch = () => {
    setSearch(pendingSearch);
    setDate(pendingDate);
    setCategory(pendingCategory);
    setHasSearched(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday =
    pendingDate &&
    "getTime" in pendingDate &&
    new Date(pendingDate).getTime() === today.getTime();

  const isTomorrow =
    pendingDate &&
    "getTime" in pendingDate &&
    new Date(pendingDate).getTime() === tomorrow.getTime();

  const isThisWeek =
    pendingDate && "start" in pendingDate && "end" in pendingDate;

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
          value={pendingSearch}
          onChangeText={setPendingSearch}
        />
      </View>

      <Text style={styles.label}>Datum</Text>
      <DateQuickSelect
        isToday={isToday}
        isTomorrow={isTomorrow}
        isThisWeek={isThisWeek}
        onSelectToday={() => {
          setPendingDate(new Date());
          setCalendarVisible(false);
        }}
        onSelectTomorrow={() => {
          const tmr = new Date(Date.now() + 86400000);
          tmr.setHours(0, 0, 0, 0);
          setPendingDate(tmr);
          setCalendarVisible(false);
        }}
        onSelectThisWeek={() => {
          const now = new Date();
          const day = now.getDay();
          const diffToMonday = (day === 0 ? -6 : 1) - day;
          const monday = new Date(now);
          monday.setDate(now.getDate() + diffToMonday);
          monday.setHours(0, 0, 0, 0);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);
          setPendingDate({ start: monday, end: sunday });
          setCalendarVisible(false);
        }}
      />

      {pendingDate && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: Colors.text800 }}>
            Ausgewähltes Datum:{" "}
            {(() => {
              if ("start" in pendingDate && "end" in pendingDate) {
                return `${formatDate(pendingDate.start)} – ${formatDate(
                  pendingDate.end
                )}`;
              } else {
                return formatDate(new Date(pendingDate));
              }
            })()}
          </Text>
          <TouchableOpacity onPress={() => setPendingDate(null)}>
            <Text style={{ color: Colors.primaryRed, marginTop: 4 }}>
              Auswahl löschen
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.chooseDateBtn}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.chooseDateBtnText}>Wähle Datum</Text>
      </TouchableOpacity>

      {isCalendarVisible && (
        <View style={styles.calendarModal}>
          <CalendarModal
            pendingDate={pendingDate}
            setPendingDate={setPendingDate}
            setCalendarVisible={setCalendarVisible}
          />
          <TouchableOpacity
            style={styles.calendarCloseBtn}
            onPress={() => setCalendarVisible(false)}
          >
            <Text style={styles.calendarCloseBtnText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      )}
      <CategoryDropdown
        categories={categoriesList}
        selectedCategory={pendingCategory}
        onSelectCategory={setPendingCategory}
      />

      <TouchableOpacity
        style={[
          styles.chooseDateBtn,
          { backgroundColor: isModified ? Colors.primaryRed : Colors.card400 },
        ]}
        disabled={!isModified}
        onPress={handleSearch}
      >
        <Text style={styles.chooseDateBtnText}>Suche</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ergebnisse</Text>
      {hasSearched ? (
        filteredEvents.length === 0 ? (
          <Text style={{ color: Colors.text500, marginTop: 10 }}>
            Keine Ergebnisse gefunden.
          </Text>
        ) : (
          <EventList events={filteredEvents} onPressEvent={onPressEvent} />
        )
      ) : (
        <Text style={{ color: Colors.text500, marginTop: 10 }}>
          Bitte wähle mindestens einen Filter und drücke "Suche".
        </Text>
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
});

export default SucheScreen;
