import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { AppScreenProps } from "../../App"; // Importa o tipo de props
import { Ionicons } from "@expo/vector-icons";

// Define as props desta tela
type QueueScreenProps = AppScreenProps<"Queue">;

export default function QueueScreen({ navigation }: QueueScreenProps) {
  const theme = useTheme() as any;
  const styles = createStyles(theme);

  // --- Componentes Internos para replicar o Canva ---

  // Card de Informação (ex: "15 min")
  const InfoCard = ({
    value,
    label,
    color,
  }: {
    value: string;
    label: string;
    color: string;
  }) => (
    <View style={[styles.infoCard, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.infoValue, { color: color }]}>{value}</Text>
      <Text style={[styles.infoLabel, { color: `${color}99` }]}>{label}</Text>
    </View>
  );

  // Card de Status (ex: "Ferry Operacional")
  const StatusCard = ({
    icon,
    title,
    subtitle,
    color,
    bgColor,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
    bgColor: string;
  }) => (
    <View style={[styles.statusCard, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={28} color={color} style={styles.statusIcon} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.statusTitle, { color: color }]}>{title}</Text>
        <Text style={[styles.statusSubtitle, { color: `${color}CC` }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );

  // --- Renderização Principal ---
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      {/* 1. Cabeçalho Azul (do Canva) */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.onPrimary}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.onPrimary,
              fontFamily: theme.fonts.primaryBold,
            },
          ]}
        >
          Mapa da Travessia
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 2. O Mapa (Recriado com Views) */}
        <View
          style={[
            styles.mapContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {/* Fundo do Mapa (Oceano) */}
          <View style={[styles.mapBackground, { backgroundColor: "#a0d8f0" }]}>
            {/* Título do Mapa */}
            <View
              style={[
                styles.mapTitleContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.mapTitle,
                  { fontFamily: theme.fonts.primaryBold },
                ]}
              >
                São Luís ⇄ Alcântara
              </Text>
            </View>

            {/* Lado Esquerdo (Alcântara / Cujupe) */}
            <View style={[styles.landLeft, { backgroundColor: "#a8d59a" }]} />
            <View
              style={[styles.portLabelLeft, { backgroundColor: "#F59E0B" }]}
            >
              <Text style={styles.portLabelText}>Cujupe</Text>
            </View>

            {/* Lado Direito (São Luís / Ponta da Espera) */}
            <View style={[styles.landRight, { backgroundColor: "#a8d59a" }]} />
            <View
              style={[styles.portLabelRight, { backgroundColor: "#F59E0B" }]}
            >
              <Text style={styles.portLabelText}>Ponta da Espera</Text>
            </View>

            {/* Rota (Linha Vermelha) */}
            <View style={[styles.routeLine, { backgroundColor: "#EF4444" }]} />

            {/* Ícone do Ferry (do Canva) */}
            <View
              style={[
                styles.ferryIconContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Ionicons name="boat" size={32} color={theme.colors.primary} />
            </View>
          </View>

          {/* 3. Cards de Informação (do Canva) */}
          <View style={styles.infoGrid}>
            <InfoCard value="2.1 km" label="Distância" color="#1E88E5" />
            <InfoCard value="15 min" label="Duração" color="#10B981" />
            <InfoCard value="67%" label="Ocupação" color="#F59E0B" />
          </View>

          {/* 4. Cards de Status (do Canva) */}
          <View style={styles.statusContainer}>
            <StatusCard
              icon="checkmark-circle"
              title="Ferry Operacional"
              subtitle="Próxima saída: 14:00"
              color="#2E7D32" // Verde escuro
              bgColor="#E8F5E8" // Verde claro
            />
            <StatusCard
              icon="sunny"
              title="Condições Favoráveis"
              subtitle="Sol • 24°C • Mar calmo"
              color="#E65100" // Laranja escuro
              bgColor="#FFF8E1" // Laranja claro
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 5. Estilos para recriar o protótipo do Canva
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingTop: 40,
      elevation: 4,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 22,
      marginLeft: 16,
    },
    content: {
      padding: 24,
    },
    mapContainer: {
      borderRadius: 16,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: "hidden", // Importante para o mapa
    },
    mapBackground: {
      height: 400,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    mapTitleContainer: {
      position: "absolute",
      top: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      elevation: 5,
      zIndex: 10,
    },
    mapTitle: {
      fontSize: 18,
      color: theme.colors.text,
    },
    landLeft: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "30%",
      borderTopRightRadius: 100,
      borderBottomRightRadius: 100,
      opacity: 0.6,
    },
    landRight: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "30%",
      borderTopLeftRadius: 100,
      borderBottomLeftRadius: 100,
      opacity: 0.6,
    },
    portLabelLeft: {
      position: "absolute",
      left: "25%",
      top: "50%",
      transform: [{ translateX: -30 }, { translateY: -15 }],
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      elevation: 2,
    },
    portLabelRight: {
      position: "absolute",
      right: "25%",
      top: "50%",
      transform: [{ translateX: 30 }, { translateY: -15 }],
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      elevation: 2,
    },
    portLabelText: {
      color: "white",
      fontWeight: "700",
    },
    routeLine: {
      position: "absolute",
      left: "30%",
      right: "30%",
      height: 8,
      top: "50%",
      transform: [{ translateY: -4 }],
      opacity: 0.8,
    },
    ferryIconContainer: {
      padding: 12,
      borderRadius: 30, // Círculo
      elevation: 8,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -28 }, { translateY: -28 }], // Centraliza o ícone
      zIndex: 5,
    },
    infoGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    infoCard: {
      flex: 1, // Para dividir em 3 colunas
      margin: 8,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    infoValue: {
      fontSize: 20,
      fontFamily: theme.fonts.primaryBold,
    },
    infoLabel: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
    },
    statusContainer: {
      padding: 24,
    },
    statusCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    statusIcon: {
      marginRight: 16,
    },
    statusTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryBold,
    },
    statusSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
    },
  });
