import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 1. Import corrigido
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // 2. Importe os tipos
import { RootStackParamList } from "../../App";

// 3. Defina o tipo de navegação
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const theme = useTheme();
  const nav = useNavigation<HomeNavigationProp>(); // 4. Tipe o hook
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O App.tsx vai detectar o logout e navegar automaticamente
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Componente de botão do menu
  const MenuButton = ({
    icon,
    title,
    color,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuButton, { backgroundColor: theme.colors.surface }]}
    >
      <Ionicons name={icon} size={28} color={color} />
      <Text
        style={[styles.menuButtonText, { fontFamily: theme.fonts.primaryBold }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>
          FerryFlow
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24} // Aumentei o ícone
            color={theme.colors.onPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text
          style={[
            styles.welcomeText,
            { fontFamily: theme.fonts.primaryRegular },
          ]}
        >
          Bem-vindo! Selecione uma opção:
        </Text>
        <View style={styles.buttonGrid}>
          <MenuButton
            title="Comprar Passagem"
            icon="cart-outline"
            color={theme.colors.primary}
            onPress={() => nav.navigate("Purchase", undefined)} // Envia 'undefined'
          />
          <MenuButton
            title="Horários"
            icon="time-outline"
            color="#10B981" // Verde
            onPress={() => nav.navigate("Schedule")}
          />
          <MenuButton
            title="Fila de Embarque"
            icon="people-outline"
            color="#F59E0B" // Amarelo
            onPress={() => nav.navigate("Queue")}
          />
          <MenuButton
            title="Status do Ferry"
            icon="boat-outline"
            color="#EF4444" // Vermelho
            onPress={() => nav.navigate("FerryStatus")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 5. Adicionei um StyleSheet para organizar
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 40, // Espaço extra para o Safe Area
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuButton: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonText: {
    fontWeight: "700",
    marginTop: 12,
    fontSize: 15,
  },
});
