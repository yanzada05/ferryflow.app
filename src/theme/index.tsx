import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

const ThemeContext = React.createContext({} as any);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  const theme = {
    colors: {
      primary: '#1E88E5',
      primaryDark: '#1565C0',
      onPrimary: '#FFFFFF',
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      muted: '#94A3B8'
    },
    fonts: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      bold: 'Inter_700Bold'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
