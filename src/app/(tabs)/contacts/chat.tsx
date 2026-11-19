import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { Bubble } from "@/components/Bubble";
import type { Message } from "@/types/message";

const START_MESSAGES: Message[] = [
  { id: "1", kind: "text", text: "Hi!",                mine: false },
  { id: "2", kind: "text", text: "Hello Awa 👋",       mine: true  },
  { id: "3", kind: "text", text: "Ready for the lab?", mine: false },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(START_MESSAGES);
  const [draft, setDraft] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [canOpenSettings, setCanOpenSettings] = useState(false);

  async function pickPhoto() {
    setNotice(null);
    setCanOpenSettings(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;
    setPhotoUri(result.assets[0].uri);
  }

  async function takePhoto() {
    setNotice(null);
    setCanOpenSettings(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      if (permission.canAskAgain) {
        setNotice("Camera access is needed to take a photo.");
      } else {
        setNotice("Camera access is blocked. Open Settings to allow camera access.");
        setCanOpenSettings(true);
      }
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;
    setPhotoUri(result.assets[0].uri);
  }

  async function keepPhoto(tempUri: string): Promise<string> {
    const source = new File(tempUri);
    const ext = source.extension || ".jpg";
    const destination = new File(Paths.document, `photo-${Date.now()}${ext}`);
    await source.copy(destination);
    return destination.uri;
  }

  async function sendPhoto() {
    if (!photoUri) return;
    const uri = await keepPhoto(photoUri);
    const next: Message = {
      id: String(Date.now()),
      kind: "photo",
      uri,
      mine: true,
    };
    setMessages((prev) => [...prev, next]);
    setPhotoUri(null);
  }

  async function send() {
    if (photoUri) {
      await sendPhoto();
      return;
    }
    if (draft.trim() === "") return;
    const next: Message = {
      id: String(Date.now()),
      kind: "text",
      text: draft.trim(),
      mine: true,
    };
    setMessages((prev) => [...prev, next]);
    setDraft("");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backLabel}>←</Text>
          </Pressable>
          <Image
            source="https://i.pravatar.cc/100"
            style={styles.avatar}
          />
          <Text style={styles.name}>Awa Diop</Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble message={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No messages yet. Say hello.</Text>
          }
          ListHeaderComponent={
            <Text style={styles.dateLabel}>Today</Text>
          }
          style={styles.messages}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        {notice && (
          <View style={styles.noticeBar}>
            <Text style={styles.noticeText}>{notice}</Text>
            {canOpenSettings && (
              <Pressable
                style={styles.settingsButton}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.settingsLabel}>Open Settings</Text>
              </Pressable>
            )}
          </View>
        )}
        {photoUri && (
          <View style={styles.previewBar}>
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <Pressable
              style={styles.removeButton}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.removeLabel}>Remove</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.footer}>
          <Pressable style={styles.iconButton} onPress={pickPhoto}>
            <Text style={styles.iconLabel}>📎</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={takePhoto}>
            <Text style={styles.iconLabel}>📷</Text>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Write a message…"
            value={draft}
            onChangeText={setDraft}
          />
          <Pressable style={styles.send} onPress={send}>
            <Text style={styles.sendLabel}>➤</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  backLabel: { fontSize: 22, color: "#1a5276" },
  name:   { fontSize: 17, fontWeight: "bold" },
  messages: { flex: 1, backgroundColor: "#f4f4f4" },
  empty:     { textAlign: "center", color: "#888", paddingVertical: 32 },
  dateLabel: { textAlign: "center", color: "#888", fontSize: 12, paddingBottom: 8 },
  noticeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fdecea",
    borderTopWidth: 1,
    borderTopColor: "#f5c6cb",
    gap: 8,
  },
  noticeText: { flex: 1, color: "#842029", fontSize: 13 },
  settingsButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#842029",
  },
  settingsLabel: { color: "#fff", fontSize: 12, fontWeight: "600" },
  previewBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  previewImage: { width: 72, height: 72, borderRadius: 8 },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  removeLabel: { color: "#333", fontSize: 13, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLabel: { fontSize: 18 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a5276",
    justifyContent: "center",
    alignItems: "center",
  },
  sendLabel: { color: "#fff", fontSize: 16 },
});
