import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import TermineScreen from "./screens/TermineScreen";
import SucheScreen from "./screens/SucheScreen";
import GesellschaftenScreen from "./screens/GesellschaftenScreen";
import OrteScreen from "./screens/OrteScreen";

const BottomTab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#3c0a6b" },
          headerTintColor: "white",
          tabBarActiveTintColor: "#3c0a6b",
        }}
      >
        <BottomTab.Screen
          name="Termine"
          component={TermineScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="calendar-check-o" size={24} color="black" />
            ),
          }}
        />
        <BottomTab.Screen
          name="Suche"
          component={SucheScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={24} color="black" />
            ),
          }}
        />
         <BottomTab.Screen
          name="Gesellschaften"
          component={GesellschaftenScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
             <FontAwesome6 name="masks-theater" size={24} color="black" />
            ),
          }}
        />
            <BottomTab.Screen
          name="Orte"
          component={OrteScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="location-dot" size={24} color="black" />
            ),
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
