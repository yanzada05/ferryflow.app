import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../theme";

// 1. Defina a "interface" para os dados da fila
// (Baseado no que você salva no PurchaseScreen)
interface QueueItem {
  id: string; // O ID do documento
  uid: string;
  time: string;
  passengers: number;
  price: number;
  status: string;
  createdAt: Timestamp;
}

export default function QueueScreen() {
  const theme = useTheme();

  // 2. A CORREÇÃO:
  // Diga ao useState que ele vai receber um array de 'QueueItem'
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta a coleção 'tickets'
    const q = query(collection(db, "tickets"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        // Mapeia os dados e aplica o tipo
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as QueueItem[];

        // 3. Agora o TypeScript aceita isso, pois 'data' é QueueItem[]
        // e 'queue' também é QueueItem[]
        setQueue(data);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar fila:", err);
        setLoading(false);
      }
    );
    return unsub; // Limpa o listener ao sair da tela
  }, []);

  // Um componente para renderizar o item da lista
  const renderItem = ({ item }: { item: QueueItem }) => (
    <View style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTime, { color: theme.colors.primary }]}>
          {item.time}
        </Text>
        <Text style={[styles.itemStatus, { color: theme.colors.muted }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.itemDetails}>
        {item.passengers} {item.passengers > 1 ? "passageiros" : "passageiro"}
      </Text>
      <Text style={[styles.itemId, { color: theme.colors.muted }]}>
        ID: {item.id}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <Text style={[styles.title, { fontFamily: theme.fonts.primaryBold }]}>
        Fila de Embarque
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={queue}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ninguém na fila.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTime: {
    fontSize: 20,
    fontWeight: "700",
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  itemDetails: {
    fontSize: 16,
    marginTop: 8,
  },
  itemId: {
    fontSize: 12,
    marginTop: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
});
