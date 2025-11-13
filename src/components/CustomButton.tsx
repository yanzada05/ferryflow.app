import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";

// 1. Defina a interface para as props do componente
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean; // '?' torna a prop opcional
}

// 2. Aplique a interface às props
export default function CustomButton({
  title,
  onPress,
  disabled = false,
}: CustomButtonProps) {
  const theme = useTheme(); // Agora 'theme' tem tipos!

  const buttonStyles = [
    styles.button,
    { backgroundColor: theme.colors.primary },
    disabled && styles.disabledButton,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: theme.colors.onPrimary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
    elevation: 0,
  },
});
