// import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import TermineScreen from "./screens/TermineScreen";
import SucheScreen from "./screens/SucheScreen";
import GesellschaftenScreen from "./screens/GesellschaftenScreen";
import OrteScreen from "./screens/OrteScreen";
import VeranstaltungScreen from "./screens/VeranstaltungScreen";

import { Colors } from "./constants/colors";
import { RootStackParamList } from "./types/navigation";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Veranstaltung"
          options={({ route }) => (
            console.log("from", route.params.from),
            {
              headerShown: true,
              title: "Veranstaltung",
              headerStyle: { backgroundColor: Colors.primaryRed },
              headerTintColor: Colors.white,
              headerBackTitle: route.params?.from ?? "Zurück",
              headerRight: () => (
                <Image
                  source={require("./assets/logo.svg")}
                  style={{ width: 30, height: 30, marginRight: 16 }}
                />
              ),
            }
          )}
          component={VeranstaltungScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primaryRed },
        headerTintColor: Colors.white,
        tabBarStyle: { backgroundColor: Colors.primaryRed, height: 60 },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.card400,
        headerRight: () => (
                <Image
                  source={require("./assets/logo.svg")}
                  style={{ width: 30, height: 30, marginRight: 16 }}
                />
              ),
      }}
    >
      <BottomTab.Screen
        name="Alle Termine"
        component={TermineScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name="calendar-check-o"
              size={24}
              color={Colors.white}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Suche"
        component={SucheScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={24} color={Colors.white} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Gesellschaften"
        component={GesellschaftenScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="masks-theater" size={24} color={Colors.white} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Orte"
        component={OrteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="location-dot" size={24} color={Colors.white} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}


