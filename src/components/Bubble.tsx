import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import type { Message } from "@/types/message";

export function Bubble({ message }: { message: Message }) {
  const mine = message.mine;

  function renderContent() {
    switch (message.kind) {
      case "text":
        return <Text style={mine && styles.textMine}>{message.text}</Text>;
      case "photo":
        return (
          <Image
            source={{ uri: message.uri }}
            style={styles.photo}
            contentFit="cover"
          />
        );
      case "location":
        return <Text style={mine && styles.textMine}>📍 Location</Text>;
    }
  }

  return (
    <View style={[styles.bubble, mine && styles.bubbleMine]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 14,
    maxWidth: "75%",
    margin: 8,
    alignSelf: "flex-start",
  },
  bubbleMine: {
    backgroundColor: "#1a5276",
    alignSelf: "flex-end",
  },
  textMine: { color: "#fff" },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});
