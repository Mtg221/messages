import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.text, isDark && styles.darkText]}>DAUST Messenger</Text>
      <Pressable
        style={[styles.button, isDark && styles.darkButton]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, isDark && styles.darkButtonText]}>
          Switch to {isDark ? "Light" : "Dark"} Mode
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", gap: 16 },
  darkContainer: { backgroundColor: "#121212" },
  text: { fontSize: 20, color: "#000" },
  darkText: { color: "#fff" },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#1a5276" },
  darkButton: { backgroundColor: "#f39c12" },
  buttonText: { color: "#fff", fontWeight: "600" },
  darkButtonText: { color: "#000", fontWeight: "600" },
});

