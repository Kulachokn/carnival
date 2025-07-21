import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { Image } from "react-native";
import Logo from "./assets/logo.svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import TermineScreen from "./screens/TermineScreen";
import SucheScreen from "./screens/SucheScreen";
import GesellschaftenScreen from "./screens/GesellschaftenScreen";
import OrteScreen from "./screens/OrteScreen";
import VeranstaltungScreen from "./screens/VeranstaltungScreen";
import GesellschaftScreen from "./screens/GesellschaftScreen";

import { Colors } from "./constants/colors";
import { RootStackParamList } from "./types/navigation";

const BottomTab = createBottomTabNavigator();
const TermineStack = createStackNavigator<RootStackParamList>();
const SucheStack = createStackNavigator<RootStackParamList>();
const GesellschaftenStack = createStackNavigator<RootStackParamList>();
const OrteStack = createStackNavigator<RootStackParamList>();

function TermineStackScreen() {
  return (
    <TermineStack.Navigator>
      <TermineStack.Screen
        name="Alle Termine"
        component={TermineScreen}
        options={{
          title: "Alle Termine",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <TermineStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        })}
      />
    </TermineStack.Navigator>
  );
}

function SucheStackScreen() {
  return (
    <SucheStack.Navigator>
      <SucheStack.Screen
        name="Suche"
        component={SucheScreen}
        options={{
          title: "Suche",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <SucheStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        })}
      />
    </SucheStack.Navigator>
  );
}

function GesellschaftenStackScreen() {
  return (
    <GesellschaftenStack.Navigator>
      <GesellschaftenStack.Screen
        name="Gesellschaften"
        component={GesellschaftenScreen}
        options={{
          title: "Gesellschaften",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <GesellschaftenStack.Screen
        name="Gesellschaft"
        component={GesellschaftScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Gesellschaft",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerBackTitleStyle: { fontSize: 18 },
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        })}
      />
    </GesellschaftenStack.Navigator>
  );
}

function OrteStackScreen() {
  return (
    <OrteStack.Navigator>
      <OrteStack.Screen
        name="Orte"
        component={OrteScreen}
        options={{
          title: "Orte",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerRight: () => (
            <Logo width={40} height={40} style={{ marginRight: 16 }} />
          ),
        }}
      />
    </OrteStack.Navigator>
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
          <BottomTab.Screen
            name="SucheTab"
            component={SucheStackScreen}
            options={{
              tabBarLabel: "Suche",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="search" size={24} color={Colors.white} />
              ),
            }}
          />
          <BottomTab.Screen
            name="GesellschaftenTab"
            component={GesellschaftenStackScreen}
            options={{
              tabBarLabel: "Gesellschaften",
              tabBarIcon: ({ color }) => (
                <FontAwesome6
                  name="masks-theater"
                  size={24}
                  color={Colors.white}
                />
              ),
            }}
          />
          <BottomTab.Screen
            name="OrteTab"
            component={OrteStackScreen}
            options={{
              tabBarLabel: "OrteTab",
              tabBarIcon: ({ color }) => (
                <FontAwesome6
                  name="location-dot"
                  size={24}
                  color={Colors.white}
                />
              ),
            }}
          />
        </BottomTab.Navigator>
      </NavigationContainer>
    </>
  );
}
