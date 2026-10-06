import { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import { ContactRow } from "@/components/ContactRow";
import { CONTACTS } from "@/data/contacts";

export default function Contacts() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/contacts/[id]", params: { id: item.id } }}
            asChild
          >
            <Pressable>
              <ContactRow contact={item} />
            </Pressable>
          </Link>
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View style={styles.titleGroup}>
                <Text style={styles.h1}>Contacts</Text>
                <Text style={styles.count}>({filtered.length})</Text>
              </View>
              <Link href="/new-message" asChild>
                <Pressable>
                  <Text style={styles.action}>New</Text>
                </Pressable>
              </Link>
            </View>
            <TextInput
              style={styles.search}
              placeholder="Search…"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No contact matches "{query}".</Text>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", justifyContent: "space-between",
               alignItems: "center", paddingBottom: 8 },
  titleGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  h1:        { fontSize: 22, fontWeight: "bold", color: "#1a5276" },
  count:     { color: "#888" },
  action:    { color: "#1a5276", fontWeight: "600" },
  search: { height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 20,
            paddingHorizontal: 14, marginBottom: 12 },
  separator: { height: 1, backgroundColor: "#e5e5e5" },
  empty:     { textAlign: "center", color: "#888", paddingVertical: 32 },
});
