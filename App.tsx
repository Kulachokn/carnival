import { StatusBar } from "expo-status-bar";
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
// const Stack = createStackNavigator<RootStackParamList>();
const TermineStack = createStackNavigator<RootStackParamList>();

function TermineStackScreen() {
  return (
    <TermineStack.Navigator>
      <TermineStack.Screen
        name="Alle Termine"
        component={TermineScreen}
        options={{
          title: "Alle Termine",
          headerStyle: { backgroundColor: Colors.primaryRed },
          headerTintColor: Colors.white,
          headerTitleAlign: "center"
        }}
      />
      <TermineStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed },
          headerTintColor: Colors.white,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerRight: () => (
            <Image
              source={require("./assets/logo.svg")}
              style={{ width: 30, height: 30, marginRight: 16 }}
            />
          ),
        })}
      />
    </TermineStack.Navigator>
  );
}

export default function App() {
  return (
    <>
    <StatusBar style="light" />
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: Colors.primaryRed, height: 60 },
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: Colors.card400,
        }}
      >
        <BottomTab.Screen
           name="AlleTermineTab"
          component={TermineStackScreen}
          options={{
            tabBarLabel: "Termine",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="calendar-check-o" size={24} color={color} />
            ),
          }}
        />
        <BottomTab.Screen name="Suche" component={SucheScreen} />
        <BottomTab.Screen
          name="Gesellschaften"
          component={GesellschaftenScreen}
        />
        <BottomTab.Screen name="Orte" component={OrteScreen} />
      </BottomTab.Navigator>
    </NavigationContainer>
    </>
  )
}