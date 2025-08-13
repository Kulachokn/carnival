import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { formatDateTimeShort } from '../utils/formatFunctions';
import { Colors } from '../constants/colors';

interface EventCardProps {
  image?: string;
  start: number;
  name: string;
  location: string;
}

const EventCard: React.FC<EventCardProps> = React.memo (({ image, start, name, location }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <Text style={styles.cardDate}>{formatDateTimeShort(start)}</Text>
      <Text style={styles.cardTitle}>{name}</Text>
      <View style={styles.cardLocationRow}>
        <FontAwesome name="map-marker" size={16} color={Colors.primaryRed} style={{ marginRight: 4 }} />
        <Text style={styles.cardLocation}>{location}</Text>
      </View>
    </View>
    <FontAwesome name="chevron-right" size={20} color={Colors.primaryRed} style={styles.cardArrow} />
  </View>
));

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card100,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: Colors.text800,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    padding: 8,
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
