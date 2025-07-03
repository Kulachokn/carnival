import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { Event } from '../types/event';
import { RootStackParamList } from '../types/navigation';
// import MapView, { Marker } from 'react-native-maps';

import PrimaryButton from '../components/PrimaruButton';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';

// Dummy coordinates for Tanzbrunnen, Cologne
const TANZBRUNNEN_COORDS = {
  latitude: 50.9475,
  longitude: 6.9747,
};

type VeranstaltungScreenRouteProp = RouteProp<RootStackParamList, 'Veranstaltung'>;

type Props = {
  route: VeranstaltungScreenRouteProp;
};

const VeranstaltungScreen: React.FC<Props> = ({ route }) => {
  const event: Event = route.params.event;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            {/* <Image source={require('../assets/calendar.png')} style={styles.icon} /> */}
            <AntDesign name="calendar" size={24} color="black" />
            <Text style={styles.infoText}>{new Date(event.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' })}</Text>
          </View>
          <View style={styles.infoItem}>
            {/* <Image source={require('../assets/clock.png')} style={styles.icon} /> */}
            <Feather name="clock" size={24} color="black" />
            <Text style={styles.infoText}>{new Date(event.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</Text>
          </View>
          <View style={styles.infoItem}>
            {/* <Image source={require('../assets/location-dot.png')} style={styles.icon} /> */}
            <EvilIcons name="location" size={24} color="black" />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
        </View>
      </View>
      {/* <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: TANZBRUNNEN_COORDS.latitude,
            longitude: TANZBRUNNEN_COORDS.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={TANZBRUNNEN_COORDS} />
        </MapView>
      </View> */}

      <View style={styles.btnContainer}>
      <PrimaryButton onPress={() => console.log('Tickets kaufen')}>Tickets kaufen</PrimaryButton>
      <Feather name="share" size={24} color={Colors.primaryRed} />
      </View>
      <View style={styles.adContainer}>
        <Text style={styles.adText}>Werbung</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Informationen</Text>
        <Text style={styles.infoDescription}>
          Lorem ipsum dolor sit amet consectetur. Sollicitudin scelerisque elementum donec est purus. Urna dis enim justo quisque morbi mus.
              
        </Text>
      </View>
    </ScrollView>
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
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: Colors.card100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    color: Colors.text800,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
    marginBottom: 30,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  adContainer: {
    backgroundColor: Colors.card200,
    borderRadius: 12,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  adText: {
    color: Colors.text500,
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: Colors.card100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text800,
  },
  infoDescription: {
    color: Colors.text700,
    fontSize: 15,
  },
});

export default VeranstaltungScreen;
