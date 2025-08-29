import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
import { formatShortDate } from "../utils/formatFunctions";
import DateQuickSelect from "../components/DateQuickSelect";
import CalendarModal from "../components/CalendarModal";
import InputSearch from "../components/InputSearch";
import { Banner } from "../types/banner";

import { useDataContext } from "../context/DataContext";
import { useLayoutEffect } from "react";
import Feather from "@expo/vector-icons/Feather";

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

  const [bannersList, setBannersList] = useState<Banner[]>([]);
  const BANNER_TYPE_LIST = 'list';

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Suche">;
  const navigation = useNavigation<NavigationProp>();

   const { openImpressum } = useDataContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={openImpressum} style={{ marginLeft: 12 }}>
          <Feather name="info" size={24} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, openImpressum]);

  useEffect(() => {
    api.fetchEvents().then((eventsArray: EventOnEvent[] | null) => {
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
   
    api.fetchBannersByType(BANNER_TYPE_LIST).then((bannersArray: Banner[] | null) => {
      setBannersList(bannersArray ?? []);
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
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <InputSearch value={pendingSearch} onChangeText={setPendingSearch} />
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
                return `${formatShortDate(
                  pendingDate.start.getTime() / 1000
                )} – ${formatShortDate(pendingDate.end.getTime() / 1000)}`;
              } else {
                return formatShortDate((pendingDate as Date).getTime() / 1000);
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
          <EventList
            bannerList={bannersList}
            events={filteredEvents}
            onPressEvent={onPressEvent}
            disableScroll
          />
        )
      ) : (
        <Text style={{ color: Colors.text500, marginTop: 10 }}>
          Bitte wähle mindestens einen Filter und drücke "Suche".
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
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
