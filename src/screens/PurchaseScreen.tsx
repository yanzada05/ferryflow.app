import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal, // Usaremos o Modal para a seleção de veículos
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { AppScreenProps } from "../../App";
import { FirebaseError } from "firebase/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";

// Importe o seletor de Data/Hora que acabamos de instalar
import DateTimePicker from "@react-native-community/datetimepicker";

// Importe nossos componentes e tipos
import CustomButton from "../components/CustomButton";
import Stepper from "../components/Stepper"; // O contador [ - ] 1 [ + ]
import { VehicleType, VEHICLE_PRICES, PASSENGER_PRICES } from "../types/data";

// Define as props desta tela
type PurchaseScreenProps = AppScreenProps<"Purchase">;

// Lista de horários disponíveis (Você pode mudar isso)
const AVAILABLE_TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

export default function PurchaseScreen({ navigation }: PurchaseScreenProps) {
  const theme = useTheme() as any; // Usamos 'as any' para simplificar a tipagem do tema

  // Estados para o formulário
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(AVAILABLE_TIMES[0]); // Começa com o primeiro horário
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(
    VehicleType.NENHUM
  );

  // Estados para controlar os seletores (Pickers e Modals)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // Para o modal de horários
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Calcula o preço total automaticamente
  const totalPrice = useMemo(() => {
    const adultsPrice = adults * PASSENGER_PRICES.adult;
    const childrenPrice = children * PASSENGER_PRICES.child;
    const vehiclePrice = VEHICLE_PRICES[selectedVehicle];
    return adultsPrice + childrenPrice + vehiclePrice;
  }, [adults, children, selectedVehicle]);

  // Função para lidar com a seleção de Data
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Esconde o seletor
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Função para lidar com a seleção de Horário
  const onSelectTime = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false); // Esconde o modal de horários
  };

  // Função para lidar com a seleção de Veículo
  const onSelectVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(false); // Esconde o modal de veículos
  };

  // Função FINAL: Envia tudo para o Firebase
  const handleConfirm = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      // 1. Cria o novo documento do ticket
      const newTicket = {
        uid: user.uid,
        origin: "Ponta da Espera",
        destination: "Cujupe",
        date: date.toLocaleDateString("pt-BR"), // Formata a data
        time: time, // Usa o horário selecionado
        passengers: {
          adults,
          children,
        },
        vehicle: selectedVehicle,
        totalPrice: totalPrice,
        status: "CONFIRMADO",
        createdAt: serverTimestamp(),
      };

      // 2. Salva no Firebase
      const docRef = await addDoc(collection(db, "tickets"), newTicket);

      // 3. Navega para a tela do Ticket (Corrigindo o bug!)
      navigation.navigate("Ticket", { ticketId: docRef.id });
    } catch (err) {
      if (err instanceof FirebaseError) {
        Alert.alert("Erro ao confirmar", err.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

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
    // Estilos do Modal
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

        {/* --- Seção de Data e Hora --- */}
        <Text style={styles.sectionTitle}>Data e Horário</Text>

        {/* Botão de Data */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            Data: {date.toLocaleDateString("pt-BR")}
          </Text>
        </TouchableOpacity>

        {/* Botão de Horário */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.pickerButtonText}>Horário: {time}</Text>
        </TouchableOpacity>

        {/* Seletor de Data (só aparece se showDatePicker for true) */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            minimumDate={new Date()} // Não pode selecionar datas passadas
            onChange={onChangeDate}
          />
        )}

        {/* --- Seção de Passageiros --- */}
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

        {/* --- Seção de Veículo --- */}
        <Text style={styles.sectionTitle}>Veículo</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowVehicleModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            Veículo Selecionado: {selectedVehicle}
          </Text>
        </TouchableOpacity>

        {/* --- Total e Botão de Confirmar --- */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Valor Total</Text>
          <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>
          <CustomButton
            title={loading ? "Confirmando..." : "Confirmar Compra"}
            onPress={handleConfirm}
            disabled={loading}
          />
        </View>
      </ScrollView>

      {/* --- Modal de Seleção de Horário --- */}
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

      {/* --- Modal de Seleção de Veículo --- */}
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
