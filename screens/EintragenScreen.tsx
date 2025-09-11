import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

// The URL will be updated later
const FORM_URL = 'https://koelnerkarneval.de';

const EintragenScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const openBrowser = async () => {
      try {
        const canOpen = await Linking.canOpenURL(FORM_URL);
        if (canOpen) {
          await Linking.openURL(FORM_URL);
        } else {
          console.error("Cannot open URL:", FORM_URL);
        }
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    };

    openBrowser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primaryRed} />
      <Text style={styles.text}>Öffne Browser...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text800,
  },
});

export default EintragenScreen;
