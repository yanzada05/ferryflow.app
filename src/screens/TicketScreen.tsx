import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../theme";
import { AppScreenProps } from "../../App"; // Importa o tipo de props
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";

// Define o tipo de props que esta tela espera
type TicketScreenProps = AppScreenProps<"Ticket">;

// Define como é o formato de um Ticket
interface Ticket extends DocumentData {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: {
    adults: number;
    children: number;
  };
  vehicle: string;
  totalPrice: number;
  status: string;
}

export default function TicketScreen({ route, navigation }: TicketScreenProps) {
  // O 'as any' é só para ajudar o TypeScript
  const theme = useTheme() as any;
  const { ticketId } = route.params; // Pega o ID do ticket enviado pela rota

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados do ticket no Firebase assim que a tela abre
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "tickets", ticketId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTicket({ id: docSnap.id, ...docSnap.data() } as Ticket);
        } else {
          setError("Ticket não encontrado.");
        }
      } catch (err) {
        setError("Erro ao buscar o ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  // Estilos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    scrollContainer: {
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 24,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.bg,
    },
    errorText: {
      fontSize: 18,
      color: "red",
      textAlign: "center",
    },
    ticketBox: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    label: {
      fontSize: 16,
      color: theme.colors.muted,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      maxWidth: "60%",
      textAlign: "right",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: theme.colors.primary,
    },
    totalLabel: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
  });

  // 1. Tela de Carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.muted }}>
          Buscando seu ticket...
        </Text>
      </View>
    );
  }

  // 2. Tela de Erro
  if (error || !ticket) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          {error || "Ticket não encontrado."}
        </Text>
        <CustomButton
          title="Voltar para Home"
          onPress={() => navigation.navigate("Home")}
        />
      </SafeAreaView>
    );
  }

  // 3. Tela de Sucesso
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ticket Confirmado!</Text>
        <View style={styles.ticketBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[styles.value, { color: "green", fontWeight: "bold" }]}
            >
              {ticket.status}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rota</Text>
            <Text style={styles.value}>
              {ticket.origin} → {ticket.destination}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{ticket.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Horário</Text>
            <Text style={styles.value}>{ticket.time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Veículo</Text>
            <Text style={styles.value}>{ticket.vehicle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adultos</Text>
            <Text style={styles.value}>{ticket.passengers.adults}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Crianças</Text>
            <Text style={styles.value}>{ticket.passengers.children}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Valor Total</Text>
            <Text style={styles.totalValue}>
              R$ {ticket.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 32 }}>
          <CustomButton
            title="Voltar para Home"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
