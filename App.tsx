import "react-native-url-polyfill/auto";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import ThemeProvider from "./src/theme";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PurchaseScreen from "./src/screens/PurchaseScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import StatusScreen from "./src/screens/StatusScreen";
import QueueScreen from "./src/screens/QueueScreen";
import FerryStatusScreen from "./src/screens/FerryStatusScreen";
import TicketScreen from "./src/screens/TicketScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/firebase/config";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Purchase: { time?: string } | undefined;
  Schedule: undefined;
  Status: undefined;
  Queue: undefined;
  FerryStatus: undefined;
  Ticket: { ticketId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("⏳ Iniciando listener de autenticação...");
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log(
        "👤 Estado do usuário detectado:",
        u ? "logado" : "não logado"
      );
      setUser(u);
      if (initializing) setInitializing(false);
    });

    return () => {
      console.log("🧹 Removendo listener de autenticação...");
      unsub();
    };
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Purchase" component={PurchaseScreen} />
              <Stack.Screen name="Schedule" component={ScheduleScreen} />
              <Stack.Screen name="Status" component={StatusScreen} />
              <Stack.Screen name="Queue" component={QueueScreen} />
              <Stack.Screen name="FerryStatus" component={FerryStatusScreen} />
              <Stack.Screen name="Ticket" component={TicketScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
