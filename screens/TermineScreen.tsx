import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { events } from '../data/events';
import { FontAwesome } from '@expo/vector-icons';
import EventCard from '../components/EventCard';
import { Colors } from '../constants/colors';

const today = new Date();

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }) + ' · ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function TermineScreen() {
  const [showUpcoming, setShowUpcoming] = useState(true);

  const filteredEvents = events
    .filter(event => showUpcoming ? new Date(event.date) >= today : new Date(event.date) < today)
    .sort((a, b) => showUpcoming
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showUpcoming && styles.toggleActive]}
          onPress={() => setShowUpcoming(true)}
        >
          <Text style={[styles.toggleText, showUpcoming && styles.toggleTextActive]}>Demnächst</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showUpcoming && styles.toggleActive]}
          onPress={() => setShowUpcoming(false)}
        >
          <Text style={[styles.toggleText, !showUpcoming && styles.toggleTextActive]}>Zurückliegend</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard
            image={item.image}
            date={item.date}
            title={item.title}
            location={item.location}
          />
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card200,
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: 'center',
    padding: 4,
    width: '80%'
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primaryRed,
  },
  toggleText: {
    color: Colors.primaryRed,
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleTextActive: {
    color: Colors.white,
  },
});

export default TermineScreen;