import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { Colors } from '../constants/colors';
import { Event } from '../types/event';

// type RootStackParamList = {
//   Veranstaltung: { event: Event }; 
// };
import { RootStackParamList } from '../types/navigation';

type VeranstaltungScreenRouteProp = RouteProp<RootStackParamList, 'Veranstaltung'>;

type Props = {
  route: VeranstaltungScreenRouteProp;
};

const VeranstaltungScreen: React.FC<Props> = ({ route }) => {
  const event: Event = route.params.event;
  console.log('event: ', route.params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.title}>{event.date}</Text>
      <Text style={styles.title}>{event.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text800,
    marginBottom: 16,
  },
});

export default VeranstaltungScreen;
