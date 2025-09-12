import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, Image } from "react-native";
import { Linking } from "react-native";

import TermineScreen from "./screens/TermineScreen";
import SucheScreen from "./screens/SucheScreen";
import GesellschaftenScreen from "./screens/GesellschaftenScreen";
import OrteScreen from "./screens/OrteScreen";
import VeranstaltungScreen from "./screens/VeranstaltungScreen";
import GesellschaftScreen from "./screens/GesellschaftScreen";
import VeranstaltungsortScreen from "./screens/VeranstaltungsortScreen";
import EintragenScreen from "./screens/EintragenScreen";
import Toast from "react-native-toast-message";
import SplashAdScreen from "./screens/SplashAdScreen";

import { Colors } from "./constants/colors";
import { RootStackParamList } from "./types/navigation";

import { DataProvider } from "./context/DataContext";
import { SearchProvider } from "./context/SearchContext";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTab = createBottomTabNavigator();
const TermineStack = createStackNavigator<RootStackParamList>();
const SucheStack = createStackNavigator<RootStackParamList>();
const GesellschaftenStack = createStackNavigator<RootStackParamList>();
const OrteStack = createStackNavigator<RootStackParamList>();
const EintragenStack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const Logo = require("./resources/iTunesArtwork.png"); 
const HeaderLogoButton = () => (
  <Pressable
    onPress={() => Linking.openURL("https://koelnerkarneval.de")}
    style={{ marginRight: 8 }}
  >
    <Image
      source={Logo}
      style={{ width: 40, height: 40, marginRight: 8, marginBottom: 10 }}
    />
  </Pressable>
);

function TermineStackScreen() {
   const insets = useSafeAreaInsets();
  return (
    <TermineStack.Navigator>
      <TermineStack.Screen
        name="Termine"
        component={TermineScreen}
        options={{
          title: "Alle Termine",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        }}
      />
      <TermineStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerBackVisible: true,
          headerBackTitle: "Termine",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
    </TermineStack.Navigator>
  );
}

function SucheStackScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SucheStack.Navigator>
      <SucheStack.Screen
        name="Suche"
        component={SucheScreen}
        options={{
          title: "Suche",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        }}
      />
      <SucheStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerBackVisible: true,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
    </SucheStack.Navigator>
  );
}

function GesellschaftenStackScreen() {
  const insets = useSafeAreaInsets();
  return (
    <GesellschaftenStack.Navigator>
      <GesellschaftenStack.Screen
        name="Gesellschaften"
        component={GesellschaftenScreen}
        options={{
          title: "Gesellschaften",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        }}
      />
      <GesellschaftenStack.Screen
        name="Gesellschaft"
        component={GesellschaftScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Gesellschaft",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerBackVisible: true,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerBackTitleStyle: { fontSize: 16 },
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
      <GesellschaftenStack.Screen
        name="Veranstaltung"
        component={VeranstaltungScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltung",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerBackVisible: true,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerBackTitleStyle: { fontSize: 16 },
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
    </GesellschaftenStack.Navigator>
  );
}

function OrteStackScreen() {
  const insets = useSafeAreaInsets();
  return (
    <OrteStack.Navigator>
      <OrteStack.Screen
        name="Orte"
        component={OrteScreen}
        options={{
          title: "Orte",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        }}
      />
      <OrteStack.Screen
        name="Veranstaltungsort"
        component={VeranstaltungsortScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Veranstaltungsort",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerBackVisible: true,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
    </OrteStack.Navigator>
  );
}

function EintragenStackScreen() {
  const insets = useSafeAreaInsets();
  return (
    <EintragenStack.Navigator>
      <EintragenStack.Screen
        name="Eintragen"
        component={EintragenScreen}
        options={{
          title: "Veranstaltung eintragen",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 60 + insets.top },
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        }}
      />
    </EintragenStack.Navigator>
  );
}

function MainTabs() {
   const insets = useSafeAreaInsets();
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryRed,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginTop: 0,
          paddingHorizontal: 0,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.label,
        tabBarIconStyle: {
          marginBottom: 3,
        },
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
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="GesellschaftenTab"
        component={GesellschaftenStackScreen}
        options={{
          tabBarLabel: "Verbände",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="masks-theater" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="OrteTab"
        component={OrteStackScreen}
        options={{
          tabBarLabel: "Orte",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="location-dot" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="EintragenTab"
        component={EintragenStackScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Linking.openURL('https://koelnerkarneval.de');
          },
        }}
        options={{
          tabBarLabel: "Eintragen",
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus-circle" size={24} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <SearchProvider>
          <StatusBar style="light"/>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashAd"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="SplashAd" component={SplashAdScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </SearchProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
