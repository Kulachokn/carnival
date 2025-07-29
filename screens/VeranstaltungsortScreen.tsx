import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types/navigation';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';

type VeranstaltungsortScreenRouteProp = RouteProp<RootStackParamList, 'Veranstaltungsort'>;

type Props = {
  route: VeranstaltungsortScreenRouteProp;
};

const VeranstaltungsortScreen: React.FC<Props> = ({ route }) => {
  const { ort } = route.params;

  const handleCopyAddress = () => {
    Clipboard.setStringAsync(ort.address);
    Alert.alert('Adresse kopiert');
  };

  const handleOpenWebsite = () => {
    if (ort.link) {
      Linking.openURL(ort.link);
    }
  };

  const handleRoute = () => {
    // Open Google Maps with the address
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ort.address)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapBox}>
    
      </View>
      <View style={styles.addressRow}>
        <Text style={styles.addressLabel}>Address</Text>
        <TouchableOpacity onPress={handleCopyAddress}>
          <Feather name="copy" size={20} color={Colors.text800} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText}>{ort.address}</Text>
      <TouchableOpacity style={styles.websiteBtn} onPress={handleOpenWebsite}>
        <Text style={styles.websiteBtnText}>Website des Veranstalters</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.routeBtn} onPress={handleRoute}>
        <Text style={styles.routeBtnText}>Route berechnen</Text>
        <Feather name="external-link" size={18} color={Colors.text800} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  mapBox: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapImage: {
    width: '100%',
    height: 160,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text800,
  },
  addressText: {
    fontSize: 16,
    color: Colors.text800,
    marginBottom: 20,
  },
  websiteBtn: {
    backgroundColor: Colors.primaryRed,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  websiteBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeBtn: {
    backgroundColor: Colors.card200,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  routeBtnText: {
    color: Colors.text800,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VeranstaltungsortScreen;