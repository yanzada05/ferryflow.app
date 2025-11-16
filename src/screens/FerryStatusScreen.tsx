import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { AppScreenProps } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Define as props desta tela
type FerryStatusScreenProps = AppScreenProps<"FerryStatus">;

// Define a "interface" dos dados que esperamos do Firestore
interface FerryStatus {
  id: string;
  name: string;
  state: "Embarcando" | "Em Trânsito" | "Atracado" | "Manutenção";
  occupancy: number; // Nível de ocupação (0-100)
}

// --- Componentes Internos para replicar o Canva ---

/**
 * Card Principal: Mostra a posição na fila (estimativa do Canva)
 */
const QueuePositionCard = ({ theme }: { theme: any }) => {
  const styles = createStyles(theme);
  const queuePosition = 12;
  const peopleAhead = 11;
  const estimatedTime = 8;
  const progress = 75; // 75% da barra (estimativa)

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="people" size={32} color={theme.colors.primary} />
      </View>
      <Text style={styles.queuePositionTitle}>Posição #{queuePosition}</Text>
      <Text style={[styles.queueSubtitle, { color: theme.colors.muted }]}>
        na fila de embarque
      </Text>

      {/* Barra de Progresso (do Canva) */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>

      <View style={styles.queueStatsContainer}>
        <View style={styles.queueStat}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {estimatedTime} min
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.muted }]}>
            Tempo Estimado
          </Text>
        </View>
        <View style={styles.queueStat}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {peopleAhead}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.muted }]}>
            À sua frente
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Card 2: Mostra o Clima e a Maré (estimativa)
 */
const WeatherCard = ({ theme }: { theme: any }) => {
  const styles = createStyles(theme);
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.cardTitle}>Clima e Maré</Text>
      <View style={styles.statusRow}>
        <Ionicons name="sunny" size={24} color="#F59E0B" />
        <Text style={styles.statusText}>Condições Favoráveis (Sol, 24°C)</Text>
      </View>
      <View style={styles.statusRow}>
        <Ionicons name="swap-vertical" size={24} color={theme.colors.primary} />
        <Text style={styles.statusText}>Maré Baixa (0.8m)</Text>
      </View>
    </View>
  );
};

/**
 * Card 3: Status dos Ferries (DADOS REAIS DO FIREBASE)
 */
const FerryStatusList = ({
  theme,
  ferries,
  loading,
}: {
  theme: any;
  ferries: FerryStatus[];
  loading: boolean;
}) => {
  const styles = createStyles(theme);

  const getStatusColor = (state: string) => {
    if (state === "Embarcando" || state === "Atracado") return "#10B981"; // Verde
    if (state === "Em Trânsito") return "#F59E0B"; // Laranja
    return "#EF4444"; // Vermelho (Manutenção)
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.cardTitle}>Status dos Ferries</Text>
      {loading && <ActivityIndicator color={theme.colors.primary} />}
      {!loading && ferries.length === 0 && (
        <Text style={{ color: theme.colors.muted }}>
          Nenhum ferry reportando no momento.
        </Text>
      )}
      {ferries.map((ferry) => (
        <View key={ferry.id} style={styles.ferryRow}>
          <Ionicons name="boat" size={24} color={theme.colors.muted} />
          <View style={styles.ferryInfo}>
            <Text style={styles.ferryName}>{ferry.name}</Text>
            <Text
              style={[
                styles.ferryState,
                { color: getStatusColor(ferry.state) },
              ]}
            >
              {ferry.state}
            </Text>
          </View>
          <Text style={styles.ferryOccupancy}>{ferry.occupancy}%</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * Card 4: Atualizações em Tempo Real (estimativa do Canva)
 */
const LiveUpdatesCard = ({ theme }: { theme: any }) => {
  const styles = createStyles(theme);
  const updates = [
    {
      text: "Embarque iniciado para 14:00",
      time: "há 2 min",
      color: "#10B981",
    },
    {
      text: 'Ferry "Cidade de Araioses" atracou',
      time: "há 5 min",
      color: "#1E88E5",
    },
    { text: "Fila de veículos andando", time: "há 8 min", color: "#1E88E5" },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.cardTitle}>Atualizações em Tempo Real</Text>
      {updates.map((update, index) => (
        <View key={index} style={styles.updateRow}>
          <View style={[styles.updateDot, { backgroundColor: update.color }]} />
          <View>
            <Text style={styles.updateText}>{update.text}</Text>
            <Text style={[styles.updateTime, { color: theme.colors.muted }]}>
              {update.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// --- Renderização Principal ---
export default function FerryStatusScreen({
  navigation,
}: FerryStatusScreenProps) {
  const theme = useTheme() as any;
  const styles = createStyles(theme);

  // Estados para os dados REAIS do Firebase
  const [ferries, setFerries] = useState<FerryStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados dos ferries em tempo real (como no seu arquivo original)
  useEffect(() => {
    const q = query(collection(db, "ferries"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: FerryStatus[] = snap.docs.map(
          (d: DocumentData) =>
            ({
              id: d.id,
              ...d.data(),
            } as FerryStatus)
        );
        setFerries(data);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar ferries:", err);
        setLoading(false);
      }
    );
    return unsub; // Limpa o listener ao sair da tela
  }, []);

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
          Status da Fila
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card 1: Posição na Fila (Estimativa do Canva) */}
        <QueuePositionCard theme={theme} />

        {/* Card 2: Clima e Maré (Sua solicitação) */}
        <WeatherCard theme={theme} />

        {/* Card 3: Status dos Ferries (Dados Reais do Firebase) */}
        <FerryStatusList theme={theme} ferries={ferries} loading={loading} />

        {/* Card 4: Atualizações (Estimativa do Canva) */}
        <LiveUpdatesCard theme={theme} />
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
    card: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.primaryBold,
      color: theme.colors.text,
      marginBottom: 16,
    },
    // Estilos do Card de Posição
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginBottom: 16,
    },
    queuePositionTitle: {
      fontSize: 28,
      fontFamily: theme.fonts.primaryBold,
      color: theme.colors.text,
      textAlign: "center",
    },
    queueSubtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 24,
    },
    progressBarContainer: {
      height: 12,
      width: "100%",
      backgroundColor: "#E0E0E0",
      borderRadius: 6,
      overflow: "hidden",
      marginBottom: 16,
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 6,
    },
    queueStatsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    queueStat: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 18,
      fontFamily: theme.fonts.primaryBold,
    },
    statLabel: {
      fontSize: 14,
    },
    // Estilos do Card de Clima
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    statusText: {
      fontSize: 16,
      marginLeft: 12,
      color: theme.colors.text,
    },
    // Estilos do Card de Status do Ferry
    ferryRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    ferryInfo: {
      flex: 1,
      marginLeft: 16,
    },
    ferryName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    ferryState: {
      fontSize: 14,
      fontWeight: "700",
    },
    ferryOccupancy: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
    },
    // Estilos do Card de Atualizações
    updateRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    updateDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
      marginTop: 6,
    },
    updateText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "600",
    },
    updateTime: {
      fontSize: 14,
    },
  });
