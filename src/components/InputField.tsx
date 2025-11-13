import React from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import { useTheme } from "../theme";

// 1. Defina as props.
// Usamos 'extends TextInputProps' para que o TypeScript
// saiba que 'keyboardType', 'autoCapitalize', 'value', 'onChangeText', etc.
// são props válidas.
interface InputFieldProps extends TextInputProps {
  secure?: boolean; // Prop customizada para conveniência
}

// 2. Tipe as props e separe 'secure' do '...rest' (outras props)
export default function InputField({ secure, ...restProps }: InputFieldProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          // Usei as cores do seu tema
          borderColor: theme.colors.muted,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontFamily: theme.fonts.primaryRegular, // Adicionei a fonte do tema
          },
        ]}
        placeholderTextColor={theme.colors.muted}
        // 3. Passe todas as outras props (como value, placeholder, etc.)
        {...restProps}
        // 4. Use a prop 'secure' para ligar 'secureTextEntry'
        secureTextEntry={secure}
      />
    </View>
  );
}

// Criei um StyleSheet com base no seu tema
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 52, // Altura padrão para um campo de input
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16, // Espaçamento padrão
  },
  input: {
    fontSize: 16,
  },
});
