// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   FlatList,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Calendar, LocaleConfig } from "react-native-calendars";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// import { RootStackParamList } from "../types/navigation";
// import { Colors } from "../constants/colors";
// import api from "../api/services";
// import { EventOnEvent } from "../types/event";
// import EventCard from "../components/EventCard";
// import useFilteredEvents from "../hooks/useFilteredEvents";

// // Налаштування німецької локалі для календаря
// LocaleConfig.locales["de"] = {
//   monthNames: [
//     "Januar",
//     "Februar",
//     "März",
//     "April",
//     "Mai",
//     "Juni",
//     "Juli",
//     "August",
//     "September",
//     "Oktober",
//     "November",
//     "Dezember",
//   ],
//   monthNamesShort: [
//     "Jan.",
//     "Feb.",
//     "März",
//     "Apr.",
//     "Mai",
//     "Juni",
//     "Juli",
//     "Aug.",
//     "Sept.",
//     "Okt.",
//     "Nov.",
//     "Dez.",
//   ],
//   dayNames: [
//     "Sonntag",
//     "Montag",
//     "Dienstag",
//     "Mittwoch",
//     "Donnerstag",
//     "Freitag",
//     "Samstag",
//   ],
//   dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
//   today: "Heute",
// };
// LocaleConfig.defaultLocale = "de";

// function SucheScreen() {
//   // Нові стейти
//   const [pendingSearch, setPendingSearch] = useState("");
//   const [pendingDate, setPendingDate] = useState<Date | { start: Date; end: Date } | null>(null);
//   const [pendingCategories, setPendingCategories] = useState<
//     { label: string; value: string }[]
//   >([]);

//   const [search, setSearch] = useState("");
//   const [date, setDate] = useState<Date | { start: Date; end: Date } | null>(
//     null
//   );
//   const [categories, setCategories] = useState<
//     { label: string; value: string }[]
//   >([]);

//   const [isCalendarVisible, setCalendarVisible] = useState(false);
//   const [events, setEvents] = useState<EventOnEvent[]>([]);

//   type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Suche">;
//   const navigation = useNavigation<NavigationProp>();

// //   useEffect(() => {
// //     api.fetchEvents().then((eventsArray) => {
// //       setEvents(eventsArray);

// //       const categoryMap = new Map<string, string>();
// //       eventsArray.forEach((event) => {
// //         if (event.event_type) {
// //           Object.entries(event.event_type).forEach(([id, name]) => {
// //             categoryMap.set(id, name as string);
// //           });
// //         }
// //       });
// //       const categoriesList = Array.from(categoryMap.entries()).map(
// //         ([id, name]) => ({ label: name, value: id })
// //       );
// //       setCategories(categoriesList);
// //     });
// //   }, []);

//   const isModified =
//   search !== pendingSearch ||
//   JSON.stringify(date) !== JSON.stringify(pendingDate) ||
//   categories !== pendingCategories;

//   const filteredEvents = useFilteredEvents({
//     events,
//     search,
//     date,
//     categories,
//   });


// const handleSearch = () => {
//   setSearch(pendingSearch);
//   setDate(pendingDate);
//   setCategories(pendingCategories);
// };

//   // Поточна дата
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const isToday = date && "getTime" in date && new Date(date).getTime() === today.getTime();
//   const isTomorrow = date && "getTime" in date && new Date(date).getTime() === tomorrow.getTime();
//   const isThisWeek = date && "start" in date && "end" in date;

//   function onPressEvent(item: EventOnEvent) {
//     navigation.navigate("Veranstaltung", { event: item, from: "Suche" });
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchBox}>
//         <Ionicons
//           name="search"
//           size={22}
//           color={Colors.text500}
//           style={{ marginLeft: 10 }}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Suche"
//           placeholderTextColor={Colors.text500}
//           value={pendingSearch}
//           onChangeText={setPendingSearch}
// />
//       </View>

//       <Text style={styles.label}>Datum</Text>
//       <View style={styles.dateRow}>
//         <TouchableOpacity
//           style={[styles.dateBtn, isToday && styles.dateBtnActive]}
//           onPress={() => setPendingDate(new Date())}
//         >
//           <Text
//             style={[styles.dateBtnText, isToday && styles.dateBtnTextActive]}
//           >
//             Heute
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.dateBtn, isTomorrow && styles.dateBtnActive]}
//           onPress={() => setPendingDate(new Date(Date.now() + 86400000))}
//         >
//           <Text
//             style={[styles.dateBtnText, isTomorrow && styles.dateBtnTextActive]}
//           >
//             Morgen
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.dateBtn, isThisWeek && styles.dateBtnActive]}
//           onPress={() => {
//             const now = new Date();
//             const day = now.getDay();
//             const diffToMonday = (day === 0 ? -6 : 1) - day;
//             const monday = new Date(now);
//             monday.setDate(now.getDate() + diffToMonday);
//             monday.setHours(0, 0, 0, 0);
//             const sunday = new Date(monday);
//             sunday.setDate(monday.getDate() + 6);
//             sunday.setHours(23, 59, 59, 999);
//             setPendingDate({ start: monday, end: sunday });
//           }}
//         >
//           <Text
//             style={[styles.dateBtnText, isThisWeek && styles.dateBtnTextActive]}
//           >
//             Diese Woche
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={styles.chooseDateBtn}
//         onPress={() => setCalendarVisible(true)}
//       >
//         <Text style={styles.chooseDateBtnText}>Wähle Datum</Text>
//       </TouchableOpacity>

//       {isCalendarVisible && (
//         <View style={styles.calendarModal}>
//           <Calendar
//             onDayPress={(day) => {
//               setPendingDate(new Date(day.dateString));
//               setCalendarVisible(false);
//             }}
//             markedDates={
//               date && "getTime" in date
//                 ? {
//                     [(date as Date).toISOString().slice(0, 10)]: {
//                       selected: true,
//                       selectedColor: Colors.primaryRed,
//                       selectedTextColor: Colors.white,
//                     },
//                   }
//                 : {}
//             }
//             theme={{
//               backgroundColor: Colors.white,
//               calendarBackground: Colors.white,
//               textSectionTitleColor: Colors.text500,
//               selectedDayBackgroundColor: Colors.primaryRed,
//               selectedDayTextColor: Colors.white,
//               todayTextColor: Colors.primaryRed,
//               dayTextColor: Colors.text800,
//               textDisabledColor: Colors.text500,
//               monthTextColor: Colors.primaryRed,
//               arrowColor: Colors.primaryRed,
//               textDayFontWeight: "bold",
//               textMonthFontWeight: "bold",
//               textDayHeaderFontWeight: "bold",
//               textDayFontSize: 16,
//               textMonthFontSize: 18,
//               textDayHeaderFontSize: 14,
//             }}
//             enableSwipeMonths={true}
//           />
//           <TouchableOpacity
//             style={styles.calendarCloseBtn}
//             onPress={() => setCalendarVisible(false)}
//           >
//             <Text style={styles.calendarCloseBtnText}>Schließen</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <Text style={styles.label}>Kategorie</Text>
//       {/* Твій селектор категорій, якщо ти повернеш ModalSelector, можна вставити сюди */}

//       <Text style={styles.label}>Ergebnisse</Text>
//       {filteredEvents.length === 0 ? (
//         <Text style={{ color: Colors.text500, marginTop: 10 }}>
//           Keine Ergebnisse gefunden.
//         </Text>
//       ) : (
//         <FlatList
//           data={filteredEvents}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <Pressable onPress={() => onPressEvent(item)}>
//               <EventCard
//                 start={item.start}
//                 name={item.name}
//                 location={item.location_name ?? ""}
//               />
//             </Pressable>
//           )}
//           contentContainerStyle={{ paddingBottom: 16 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     padding: 16,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primaryRed,
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//     paddingVertical: 18,
//     marginBottom: 18,
//   },
//   logo: {
//     width: 36,
//     height: 36,
//     marginLeft: 10,
//     marginRight: 12,
//   },
//   header: {
//     color: Colors.white,
//     fontWeight: "bold",
//     fontSize: 22,
//   },
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.card200,
//     borderRadius: 16,
//     marginBottom: 18,
//     paddingVertical: 8,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: Colors.text800,
//     backgroundColor: "transparent",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   label: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 8,
//     color: Colors.text800,
//   },
//   dateRow: {
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   dateBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: Colors.card400,
//     borderRadius: 8,
//     paddingVertical: 10,
//     marginHorizontal: 4,
//     alignItems: "center",
//     backgroundColor: Colors.white,
//   },
//   dateBtnActive: {
//     backgroundColor: Colors.primaryRed,
//     borderColor: Colors.primaryRed,
//   },
//   dateBtnText: {
//     color: Colors.text800,
//     fontWeight: "bold",
//   },
//   dateBtnTextActive: {
//     color: Colors.white,
//   },
//   chooseDateBtn: {
//     backgroundColor: Colors.primaryRed,
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   chooseDateBtnText: {
//     color: Colors.white,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   calendarModal: {
//     position: "absolute",
//     top: 100,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.white,
//     borderRadius: 16,
//     padding: 16,
//     marginHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//     zIndex: 100,
//   },
//   calendarCloseBtn: {
//     marginTop: 12,
//     backgroundColor: Colors.primaryRed,
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   calendarCloseBtnText: {
//     color: Colors.white,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   modalSelector: {
//     marginBottom: 18,
//     borderWidth: 1,
//     borderColor: Colors.card400,
//     borderRadius: 8,
//     backgroundColor: Colors.card200,
//   },
//   modalSelectorInit: {
//     color: Colors.text500,
//     fontSize: 16,
//     padding: 12,
//   },
//   modalSelectorText: {
//     color: Colors.text800,
//     fontSize: 16,
//     padding: 12,
//   },
//   modalSelectorOption: {
//     color: Colors.text800,
//     fontSize: 16,
//   },
//   modalSelectorCancel: {
//     color: Colors.primaryRed,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default SucheScreen;



import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
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
import useFilteredEvents from "../hooks/useFilteredEvents";

LocaleConfig.locales["de"] = {
  monthNames: [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ],
  monthNamesShort: [
    "Jan.", "Feb.", "März", "Apr.", "Mai", "Juni",
    "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."
  ],
  dayNames: [
    "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
  ],
  dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  today: "Heute",
};
LocaleConfig.defaultLocale = "de";

function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function SucheScreen() {
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingDate, setPendingDate] = useState<Date | { start: Date; end: Date } | null>(null);
  const [pendingCategories, setPendingCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | { start: Date; end: Date } | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Suche">;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    api.getCachedEvents().then((eventsArray) => {
        console.log('з кешу');
      setEvents(eventsArray ?? []);
    });
  }, []);

  const isModified =
    search !== pendingSearch ||
    JSON.stringify(date) !== JSON.stringify(pendingDate) ||
    categories !== pendingCategories;

  const filteredEvents = useFilteredEvents({
    events,
    search,
    date,
    categories,
  });

  const handleSearch = () => {
    setSearch(pendingSearch);
    setDate(pendingDate);
    setCategories(pendingCategories);
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

  const isThisWeek = pendingDate && "start" in pendingDate && "end" in pendingDate;

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
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateBtn, isToday && styles.dateBtnActive]}
          onPress={() => {
            setPendingDate(new Date());
            setCalendarVisible(false);
          }}
        >
          <Text
            style={[styles.dateBtnText, isToday && styles.dateBtnTextActive]}
          >
            Heute
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateBtn, isTomorrow && styles.dateBtnActive]}
          onPress={() => {
            const tmr = new Date(Date.now() + 86400000);
            tmr.setHours(0, 0, 0, 0);
            setPendingDate(tmr);
            setCalendarVisible(false);
          }}
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
        >
          <Text
            style={[styles.dateBtnText, isThisWeek && styles.dateBtnTextActive]}
          >
            Diese Woche
          </Text>
        </TouchableOpacity>
      </View>

      {pendingDate && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: Colors.text800 }}>
            Ausgewähltes Datum:{" "}
            {(() => {
              if ("start" in pendingDate && "end" in pendingDate) {
                return `${formatDate(pendingDate.start)} – ${formatDate(pendingDate.end)}`;
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
          <Calendar
            onDayPress={(day) => {
              const selected = new Date(day.dateString);
              selected.setHours(0, 0, 0, 0);
              setPendingDate(selected);
              setCalendarVisible(false);
            }}
            markedDates={
              pendingDate && "getTime" in pendingDate
                ? {
                    [(pendingDate as Date).toISOString().slice(0, 10)]: {
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
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => onPressEvent(item)}>
                <EventCard
                  start={item.start}
                  name={item.name}
                  location={item.location_name ?? ""}
                />
              </Pressable>
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
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
});

export default SucheScreen;
