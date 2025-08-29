import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, Image } from "react-native";
import { Linking } from "react-native";

import TermineScreen from "./screens/TermineScreen";
import SucheScreen from "./screens/SucheScreen";
import GesellschaftenScreen from "./screens/GesellschaftenScreen";
import OrteScreen from "./screens/OrteScreen";
import VeranstaltungScreen from "./screens/VeranstaltungScreen";
import GesellschaftScreen from "./screens/GesellschaftScreen";
import VeranstaltungsortScreen from "./screens/VeranstaltungsortScreen";
import Toast from "react-native-toast-message";
import SplashAdScreen from "./screens/SplashAdScreen";

import { Colors } from "./constants/colors";
import { RootStackParamList } from "./types/navigation";

import { DataProvider } from "./context/DataContext";

const BottomTab = createBottomTabNavigator();
const TermineStack = createStackNavigator<RootStackParamList>();
const SucheStack = createStackNavigator<RootStackParamList>();
const GesellschaftenStack = createStackNavigator<RootStackParamList>();
const OrteStack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const Logo = require("./assets/itunesartwork.png");
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
  return (
    <TermineStack.Navigator>
      <TermineStack.Screen
        name="Termine"
        component={TermineScreen}
        options={{
          title: "Alle Termine",
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
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
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
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
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
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
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
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
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
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
          headerStyle: { backgroundColor: Colors.primaryRed, height: 100 },
          headerTintColor: Colors.white,
          headerBackTitle: route.params?.from ?? "Zurück",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
          headerRight: () => <HeaderLogoButton />,
        })}
      />
    </OrteStack.Navigator>
  );
}

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryRed,
          height: 80,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.label,
        tabBarIconStyle: {
          marginBottom: 5,
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
          tabBarLabel: "Gesellschaften",
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
    </BottomTab.Navigator>
  );
}

export default function App() {  
  return (
    <DataProvider>
      <StatusBar style="light" />
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
    </DataProvider>
  );
}
