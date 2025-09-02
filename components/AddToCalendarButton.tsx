import React, { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import he from "he";

import PrimaryButton from "./PrimaruButton";
import { EventOnEvent } from "../types/event";

interface Props {
  event: EventOnEvent;
}

/**
 * Checks and requests calendar permissions
 * @returns Boolean indicating if permission is granted
 */
async function ensureCalendarPermissions(): Promise<boolean> {
  const { status } = await Calendar.getCalendarPermissionsAsync();
  if (status === "granted") return true;

  const { status: newStatus } = await Calendar.requestCalendarPermissionsAsync();
  if (newStatus === "granted") return true;

  // Show settings dialog if permission denied
  Alert.alert(
    "Kalenderzugriff benötigt",
    "Bitte aktiviere den Kalenderzugriff in den Einstellungen.",
    [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Einstellungen",
        onPress: () => Platform.OS === "ios" 
          ? Linking.openURL("app-settings:") 
          : Linking.openSettings()
      },
    ]
  );

  return false;
}

/**
 * Finds a suitable writable calendar
 * @returns Selected calendar object or null
 */
async function findWritableCalendar() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  if (!calendars || calendars.length === 0) {
    throw new Error('no_calendars');
  }
  
  // Filter for writable calendars only
  const writableCalendars = calendars.filter(cal => cal.allowsModifications);
  
  if (writableCalendars.length === 0) {
    throw new Error('no_writable_calendars');
  }

  // Selection logic
  if (writableCalendars.length === 1) {
    return writableCalendars[0];
  }
  
  // Find best calendar based on platform and naming
  return writableCalendars.find(cal => 
    cal.isPrimary || 
    cal.source.name === "Default" ||
    cal.source.name.includes(Platform.OS === "ios" ? "iCloud" : "Google") ||
    cal.title === "Kalender" || 
    cal.title === "Calendar"
  ) || writableCalendars[0];
}

/**
 * Formats and cleans event text fields
 * @param event The event object
 * @returns Formatted event data for calendar
 */
function formatEventData(event: EventOnEvent) {
  // Parse start date
  let startDate = new Date();
  if (event.start) {
    const timestamp = event.start > 10000000000 ? event.start : event.start * 1000;
    startDate = new Date(timestamp);
  }
  
  // End date (2 hours after start)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  // Format text fields
  return {
    title: event.name ? he.decode(event.name) : 'Unnamed Event',
    startDate,
    endDate,
    location: event.location_name ? he.decode(event.location_name) : '',
    notes: formatEventNotes(event.details || event.content || ''),
  };
}

/**
 * Cleans HTML from event notes
 */
function formatEventNotes(rawNotes: string): string {
  return he.decode(rawNotes)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/ul>|<\/ol>/gi, '\n')
    .replace(/<ul>|<ol>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Checks if event already exists in calendar
 */
async function checkEventExists(calendarId: string, eventData: any): Promise<boolean> {
  try {
    const existingEvents = await Calendar.getEventsAsync(
      [calendarId],
      new Date(eventData.startDate.getTime() - 60000),
      new Date(eventData.endDate.getTime() + 60000)
    );
    
    return existingEvents.some(existingEvent => 
      existingEvent.title === eventData.title && 
      Math.abs(new Date(existingEvent.startDate).getTime() - eventData.startDate.getTime()) < 60000
    );
  } catch (error) {
    console.log("Error checking existing events:", error);
    return false; // Assume it doesn't exist if we can't check
  }
}

/**
 * Shows appropriate error dialog based on error type
 */
function handleCalendarError(error: any) {
  console.error("Error adding to calendar:", error);
  
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : '';
  
  if (errorMsg.includes('permission')) {
    showSettingsAlert("Kalenderzugriff wurde verweigert.", "app-settings:");
  } else if (errorMsg.includes('read only')) {
    showSettingsAlert(
      "Der Kalender ist schreibgeschützt. Bitte wähle einen anderen Kalender.", 
      Platform.OS === 'ios' ? "calshow:" : "app-settings:"
    );
  } else if (errorMsg.includes('no_writable_calendars') || errorMsg.includes('beschreibbarer kalender')) {
    showSettingsAlert(
      "Es wurden keine beschreibbaren Kalender gefunden.", 
      Platform.OS === 'ios' ? "calshow:" : "app-settings:"
    );
  } else if (errorMsg.includes('no_calendars')) {
    Alert.alert("Fehler", "Keine Kalender gefunden. Bitte überprüfe deine Kalender-App.");
  } else if (errorMsg.includes('date')) {
    Alert.alert("Fehler", "Ungültiges Datum für das Event.");
  } else {
    Alert.alert("Fehler", "Event konnte nicht hinzugefügt werden.");
  }
}

function showSettingsAlert(message: string, settingsUrl: string) {
  Alert.alert(
    "Fehler", 
    message, 
    [
      { text: 'Abbrechen', style: 'cancel' },
      { 
        text: 'Einstellungen öffnen', 
        onPress: () => Platform.OS === 'ios' 
          ? Linking.openURL(settingsUrl) 
          : Linking.openSettings()
      }
    ]
  );
}

export const AddToCalendarButton: React.FC<Props> = ({ event }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  // Check if event already exists when component mounts
  React.useEffect(() => {
    async function checkIfEventExists() {
      try {
        const hasPermission = await Calendar.getCalendarPermissionsAsync();
        if (hasPermission.status !== 'granted') return;
        
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const writableCalendars = calendars.filter(cal => cal.allowsModifications);
        if (!writableCalendars.length) return;
        
        const eventData = formatEventData(event);
        
        // Check across all calendars
        for (const calendar of writableCalendars) {
          const exists = await checkEventExists(calendar.id, eventData);
          if (exists) {
            setIsAdded(true);
            break;
          }
        }
      } catch (err) {
        // Silently fail - just won't show as added
        console.log('Error checking existing event:', err);
      }
    }
    
    checkIfEventExists();
  }, [event]);
  
  const handleAddToCalendar = async () => {
    if (isAdding) return;
    setIsAdding(true);
    
    try {
      // Check permissions
      const hasPermission = await ensureCalendarPermissions();
      if (!hasPermission) {
        setIsAdding(false);
        return;
      }

      // Find suitable calendar
      const selectedCalendar = await findWritableCalendar();
      
      // Format event data
      const eventData = formatEventData(event);
      
      // Check for duplicate
      const eventExists = await checkEventExists(selectedCalendar.id, eventData);
      if (eventExists) {
        setIsAdded(true); // Mark as added since it exists
        Alert.alert("Hinweis", "Dieses Event ist bereits in deinem Kalender eingetragen.");
        setIsAdding(false);
        return;
      }
      
      // Add to calendar
      await Calendar.createEventAsync(selectedCalendar.id, eventData);
      setIsAdded(true); // Mark as added
      Alert.alert("Erfolg", "Event wurde deinem Kalender hinzugefügt!");
      
    } catch (err) {
      handleCalendarError(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <PrimaryButton
      onPress={handleAddToCalendar}
      icon={<FontAwesome name="calendar-check-o" size={24} color={"white"} />}
      disabled={isAdding || isAdded}
    >
      {isAdding ? "Wird hinzugefügt..." : isAdded ? "Hinzugefügt" : "Zum Kalender hinzufügen"}
    </PrimaryButton>
  );
};

export default AddToCalendarButton;
