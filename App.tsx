import "react-native-url-polyfill/auto";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import ThemeProvider from "./src/theme";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PurchaseScreen from "./src/screens/PurchaseScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import QueueScreen from "./src/screens/QueueScreen";
import FerryStatusScreen from "./src/screens/FerryStatusScreen";
import TicketScreen from "./src/screens/TicketScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/firebase/config";
import { ActivityIndicator, View } from "react-native";

// 1. Defina TODOS os parâmetros de rota do seu App aqui
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  // A TELA DE COMPRA PODE RECEBER 'time' DA TELA DE HORÁRIOS
  // OU NENHUM PARÂMETRO (undefined) DA TELA 'Home'
  Purchase: { time: string } | undefined;
  Schedule: undefined;
  Queue: undefined;
  FerryStatus: undefined;
  Ticket: { ticketId: string };
};

// 2. Exporte os tipos de props de tela para usar nas telas
export type AppScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// 3. Informe ao Stack os tipos de rota
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null); // Tipe o usuário

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
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
