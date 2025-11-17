import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { AppScreenProps } from "../../App";
import { auth, db } from "../firebase/config"; // 1. IMPORTE O 'db'
import { doc, setDoc } from "firebase/firestore"; // 2. IMPORTE 'doc' e 'setDoc'
import { useTicket } from "../context/TicketContext"; // 3. (Para o atalho na Home)
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import Stepper from "../components/Stepper";
import { VehicleType, VEHICLE_PRICES, PASSENGER_PRICES } from "../types/data";

// NÃO PRECISAMOS MAIS DA API DA VERCEL
// const API_URL = "https://ferryflow-v3.vercel.app/api/create-preference-simple";

type PurchaseScreenProps = AppScreenProps<"Purchase">;

const AVAILABLE_TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

export default function PurchaseScreen({ navigation }: PurchaseScreenProps) {
  const theme = useTheme() as any;
  const { setActiveTicket } = useTicket(); // (Para o atalho na Home)

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(AVAILABLE_TIMES[0]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(
    VehicleType.NENHUM
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const totalPrice = useMemo(() => {
    const adultsPrice = adults * PASSENGER_PRICES.adult;
    const childrenPrice = children * PASSENGER_PRICES.child;
    const vehiclePrice = VEHICLE_PRICES[selectedVehicle];
    return adultsPrice + childrenPrice + vehiclePrice;
  }, [adults, children, selectedVehicle]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSelectTime = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  const onSelectVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(false);
  };

  // MODO DEMONSTRAÇÃO: Salva o ticket direto no Firebase
  const handleConfirm = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log("Iniciando simulação de pagamento...");

      // 4. GERE O TICKET ID AQUI
      const ticketId = `demo_${Date.now()}_${user.uid.substring(0, 5)}`;

      // 5. CRIE O OBJETO DE DADOS DO TICKET
      const ticketData = {
        id: ticketId,
        userId: user.uid,
        origin: "Ponta da Espera",
        destination: "Cujupe",
        time: time,
        date: date.toISOString(),
        vehicle: selectedVehicle,
        totalPrice: totalPrice,
        passengers: {
          adults,
          children,
        },
        status: "Pagamento Aprovado", // 6. DEFINA O STATUS
        createdAt: new Date().toISOString(),
      };

      // 7. CRIE A REFERÊNCIA DO DOCUMENTO
      const ticketDocRef = doc(db, "tickets", ticketId);

      // 8. SALVE O TICKET DIRETAMENTE NO FIREBASE
      await setDoc(ticketDocRef, ticketData);
      console.log("Ticket salvo no Firebase com ID:", ticketId);

      // 9. (Para o atalho na Home) Salve no contexto global
      setActiveTicket(ticketData as any); // (Talvez precise ajustar o tipo)

      // 10. Simula processamento (como você já tinha)
      setTimeout(() => {
        setLoading(false);

        // Mostra confirmação de pagamento
        Alert.alert(
          "✅ Pagamento Aprovado!",
          `Compra de demonstração realizada com sucesso!\n\n` +
            `📅 Data: ${date.toLocaleDateString("pt-BR")}\n` +
            `🕐 Horário: ${time}\n` +
            `💰 Valor: R$ ${totalPrice.toFixed(2)}\n` +
            `🎫 Ticket: ${ticketId.substring(0, 16)}...`,
          [
            {
              text: "Ver Meu Ticket",
              onPress: () => {
                // 11. NAVEGUE COM O ID QUE VOCÊ ACABOU DE CRIAR
                navigation.navigate("Ticket", { ticketId: ticketId });
              },
            },
            {
              text: "Voltar para Home",
              onPress: () => navigation.navigate("Home"),
              style: "cancel",
            },
          ]
        );
      }, 1500); // 1.5s de espera
    } catch (error) {
      console.error("Erro ao salvar ticket de demonstração:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar seu ticket de demonstração."
      );
      setLoading(false);
    }
  };

  // ... (Todo o resto do seu código JSX (styles, return, modals) continua igual)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    scrollContainer: {
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.muted,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 16,
    },
    pickerButton: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      marginBottom: 12,
    },
    pickerButtonText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    totalContainer: {
      marginTop: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    totalText: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
    },
    totalPrice: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 24,
      width: "90%",
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
    },
    modalItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    modalItemText: {
      fontSize: 18,
      textAlign: "center",
    },
    modalCancel: {
      marginTop: 16,
      padding: 12,
    },
    modalCancelText: {
      fontSize: 16,
      color: "red",
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Comprar Passagem</Text>
        <Text style={styles.subtitle}>Ponta da Espera → Cujupe</Text>

        <Text style={styles.sectionTitle}>Data e Horário</Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            Data: {date.toLocaleDateString("pt-BR")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.pickerButtonText}>Horário: {time}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.sectionTitle}>Passageiros</Text>
        <Stepper
          label="Adultos"
          value={adults}
          onIncrement={() => setAdults((a) => a + 1)}
          onDecrement={() => setAdults((a) => Math.max(1, a - 1))}
        />
        <Stepper
          label="Crianças"
          value={children}
          onIncrement={() => setChildren((c) => c + 1)}
          onDecrement={() => setChildren((c) => Math.max(0, c - 1))}
        />

        <Text style={styles.sectionTitle}>Veículo</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowVehicleModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            Veículo Selecionado: {selectedVehicle}
          </Text>
        </TouchableOpacity>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Valor Total</Text>
          <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>

          {loading ? (
            <View>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  color: theme.colors.muted,
                }}
              >
                Processando pagamento...
              </Text>
            </View>
          ) : (
            <CustomButton
              title="Confirmar e Pagar"
              onPress={handleConfirm}
              disabled={loading}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Horário</Text>
            <ScrollView>
              {AVAILABLE_TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.modalItem}
                  onPress={() => onSelectTime(t)}
                >
                  <Text style={styles.modalItemText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showVehicleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Veículo</Text>
            <ScrollView>
              {Object.values(VehicleType).map((vehicle) => (
                <TouchableOpacity
                  key={vehicle}
                  style={styles.modalItem}
                  onPress={() => onSelectVehicle(vehicle)}
                >
                  <Text style={styles.modalItemText}>{vehicle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowVehicleModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
