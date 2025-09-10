import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// The URL will be updated later
const FORM_URL = 'https://koelnerkarneval.de';

const EintragenScreen = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: FORM_URL }} 
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});

export default EintragenScreen;
