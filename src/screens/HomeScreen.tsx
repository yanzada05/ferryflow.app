import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// Defina o tipo de navegação
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

// Componente de botão do menu (interno)
const MenuButton = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) => {
  const theme = useTheme() as any;
  const styles = menuButtonStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuButton, { backgroundColor: theme.colors.surface }]}
    >
      {/* Ícone dentro de um círculo colorido, como no Canva */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: `${color}20` }, // Cor de fundo leve
        ]}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View>
        <Text
          style={[
            styles.menuButtonTitle,
            { fontFamily: theme.fonts.primaryBold },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.menuButtonSubtitle,
            {
              color: theme.colors.muted,
              fontFamily: theme.fonts.primaryRegular,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Componente do novo card de status (interno)
const OccupancyStatusCard = () => {
  const theme = useTheme() as any;
  const styles = cardStyles(theme);
  const occupancy = 67; // Estimativa de ocupação (como no Canva)

  return (
    <View
      style={[styles.cardContainer, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="stats-chart" size={22} color={theme.colors.muted} />
        <Text
          style={[
            styles.cardTitle,
            {
              fontFamily: theme.fonts.primaryBold,
              color: theme.colors.text,
            },
          ]}
        >
          Status Atual
        </Text>
      </View>

      <View style={styles.occupancyRow}>
        <Text style={styles.occupancyLabel}>Ocupação de Hoje</Text>
        <Text
          style={[styles.occupancyPercent, { color: theme.colors.primary }]}
        >
          {occupancy}%
        </Text>
      </View>

      <View style={styles.occupancyBarContainer}>
        <View
          style={[
            styles.occupancyBarFill,
            { width: `${occupancy}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const theme = useTheme() as any;
  const nav = useNavigation<HomeNavigationProp>();
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const styles = homeScreenStyles(theme);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>
          FerryFlow
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.touchTarget}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.colors.onPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text
          style={[
            styles.welcomeText,
            {
              fontFamily: theme.fonts.primaryRegular,
              color: theme.colors.muted,
            },
          ]}
        >
          Bem-vindo! Escolha uma opção:
        </Text>
        <View style={styles.buttonGrid}>
          {/* Ícones, Cores e Títulos atualizados para bater com o Canva */}
          <MenuButton
            title="Comprar Passagem"
            subtitle="Reserve sua viagem"
            icon="cart-outline"
            color={theme.colors.primary}
            onPress={() => nav.navigate("Purchase", undefined)}
          />
          <MenuButton
            title="Horários"
            subtitle="Próximas saídas"
            icon="time-outline"
            color="#10B981" // Verde (do Canva)
            onPress={() => nav.navigate("Schedule")}
          />
          <MenuButton
            title="Mapa de Travessia" // MUDANÇA DE NOME
            subtitle="Localização"
            icon="map-outline" // MUDANÇA DE ÍCONE (do Canva)
            color="#EF4444" // Vermelho (do Canva)
            onPress={() => nav.navigate("Queue")} // Navega para a 'QueueScreen'
          />
          <MenuButton
            title="Status da Fila" // MUDANÇA DE NOME (como no Canva)
            subtitle="Posição atual"
            icon="people-outline" // Ícone 'people' (do Canva)
            color="#F59E0B" // Laranja (do Canva)
            onPress={() => nav.navigate("FerryStatus")} // Navega para 'FerryStatusScreen'
          />
        </View>

        {/* Adição do novo Card de Ocupação */}
        <OccupancyStatusCard />
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos
const homeScreenStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 16,
      paddingTop: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 4,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
    },
    touchTarget: {
      padding: 8, // Aumenta a área de toque
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
  });

const menuButtonStyles = (theme: any) =>
  StyleSheet.create({
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
    iconCircle: {
      width: 64, // 4rem
      height: 64, // 4rem
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    menuButtonTitle: {
      fontWeight: "700",
      fontSize: 16, // Aumentei um pouco
      color: theme.colors.text,
      textAlign: "center",
    },
    menuButtonSubtitle: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 2,
    },
  });

const cardStyles = (theme: any) =>
  StyleSheet.create({
    cardContainer: {
      width: "100%",
      borderRadius: 16,
      padding: 24,
      marginTop: 8,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 20,
      color: theme.colors.text,
      marginLeft: 12,
    },
    occupancyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    occupancyLabel: {
      fontSize: 16,
      color: theme.colors.muted,
      fontFamily: theme.fonts.primaryRegular,
    },
    occupancyPercent: {
      fontSize: 18,
      fontFamily: theme.fonts.primaryBold,
    },
    occupancyBarContainer: {
      height: 12,
      width: "100%",
      backgroundColor: "#E0E0E0",
      borderRadius: 6,
      overflow: "hidden",
    },
    occupancyBarFill: {
      height: "100%",
      borderRadius: 6,
    },
  });
