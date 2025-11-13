import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme";

// Define os tipos das props que o componente vai receber
interface StepperProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function Stepper({
  label,
  value,
  onIncrement,
  onDecrement,
}: StepperProps) {
  // O 'as any' é só para ajudar o TypeScript, já que não temos o tipo exato do tema
  const theme = useTheme() as any;

  // Criamos os estilos aqui para usar o objeto 'theme'
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: 22, // Deixa o botão redondo
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 24,
      fontWeight: "bold",
      lineHeight: 28, // Ajuste para centralizar o + e -
    },
    valueContainer: {
      minWidth: 50,
      marginHorizontal: 16,
      alignItems: "center",
    },
    valueText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={onDecrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
