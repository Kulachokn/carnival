import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, SectionList, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { RouteProp } from '@react-navigation/native';
import { Gesellschaft } from '../types/gesellschaft';
import { RootStackParamList } from '../types/navigation';

type GesellschaftScreenRouteProp = RouteProp<RootStackParamList, 'Gesellschaft'>;

type Props = {
  route: GesellschaftScreenRouteProp;
};

function GesellschaftScreen({ route }: Props) {

  const org: Gesellschaft = route.params.gesellschaft;
  console.log(route.params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{org.name}</Text>
    </View>
  );
} 

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
  },
});

export default GesellschaftScreen;