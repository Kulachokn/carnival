import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface EventCardProps {
  image?: any;
  start: string;
  name: string;
  location: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }) + ' · ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

const EventCard: React.FC<EventCardProps> = ({ image, start, name, location }) => (
  <View style={styles.card}>
    <Image source={image} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardDate}>{formatDate(start)}</Text>
      <Text style={styles.cardTitle}>{name}</Text>
      <View style={styles.cardLocationRow}>
        <FontAwesome name="map-marker" size={16} color="#B11226" style={{ marginRight: 4 }} />
        <Text style={styles.cardLocation}>{location}</Text>
      </View>
    </View>
    <FontAwesome name="chevron-right" size={20} color="#B11226" style={styles.cardArrow} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card100,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.text800,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    padding: 8,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardDate: {
    color: Colors.text500,
    fontSize: 13,
    marginBottom: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    color: Colors.text800,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLocation: {
    color: Colors.text700,
    fontSize: 14,
  },
  cardArrow: {
    marginLeft: 8,
  },
});

export default EventCard;
