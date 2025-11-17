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
import { auth } from "../firebase/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import Stepper from "../components/Stepper";
import { VehicleType, VEHICLE_PRICES, PASSENGER_PRICES } from "../types/data";

// URL da API na Vercel
const API_URL = "https://ferryflow-v3.vercel.app/api/create-preference-simple";

type PurchaseScreenProps = AppScreenProps<"Purchase">;

const AVAILABLE_TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

export default function PurchaseScreen({ navigation }: PurchaseScreenProps) {
  const theme = useTheme() as any;

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

  // MODO DEMONSTRAÇÃO: Simula pagamento sem abrir Mercado Pago
  const handleConfirm = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando requisição para API...");

      // Chama a API da Vercel
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          scheduleId: `${date.toISOString().split("T")[0]}-${time}`,
          time: time,
          date: date.toISOString(),
          vehicleType: selectedVehicle,
          price: totalPrice,
          passengers: {
            adults,
            children,
          },
        }),
      });

      const data = await response.json();

      console.log("Resposta da API:", data);

      if (data.error) {
        Alert.alert(
          "Erro",
          data.message || "Não foi possível processar a compra"
        );
        setLoading(false);
        return;
      }

      if (data.success) {
        // Simula processamento do pagamento (aguarda 1.5s)
        setTimeout(() => {
          setLoading(false);

          // Mostra confirmação de pagamento
          Alert.alert(
            "✅ Pagamento Aprovado!",
            `Compra realizada com sucesso!\n\n` +
              `📅 Data: ${date.toLocaleDateString("pt-BR")}\n` +
              `🕐 Horário: ${time}\n` +
              `👥 Passageiros: ${adults} adulto(s), ${children} criança(s)\n` +
              `🚗 Veículo: ${selectedVehicle}\n` +
              `💰 Valor: R$ ${totalPrice.toFixed(2)}\n` +
              `🎫 Ticket: ${data.ticketId.substring(0, 16)}...`,
            [
              {
                text: "Ver Meu Ticket",
                onPress: () => {
                  navigation.navigate("Ticket", { ticketId: data.ticketId });
                },
              },
            ]
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao processar compra:", error);
      Alert.alert(
        "Erro",
        "Falha na conexão com o servidor. Verifique sua internet."
      );
      setLoading(false);
    }
  };

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
