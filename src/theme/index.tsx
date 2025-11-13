import React, { createContext, useContext, PropsWithChildren } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// 1. Defina a ESTRUTURA (interface) do seu tema
export interface AppTheme {
  colors: {
    primary: string;
    primaryDark: string;
    onPrimary: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
  };
  fonts: {
    primaryRegular: string;
    primaryMedium: string;
    primaryBold: string;
  };
}

// 2. Tipe o Contexto com a interface
const ThemeContext = createContext<AppTheme | undefined>(undefined);

// 3. Tipe o children do Provider
export default function ThemeProvider({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  // 4. Tipe o objeto do tema
  const theme: AppTheme = {
    colors: {
      primary: "#1E88E5",
      primaryDark: "#1565C0",
      onPrimary: "#FFFFFF",
      bg: "#F5F7FA",
      surface: "#FFFFFF",
      text: "#0F172A",
      muted: "#6B7280",
    },
    fonts: {
      primaryRegular: "Inter_400Regular",
      primaryMedium: "Inter_500Medium",
      primaryBold: "Inter_700Bold",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// 5. Tipe o retorno do hook useTheme
export function useTheme(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
