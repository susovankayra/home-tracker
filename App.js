import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from "react-native";
import * as FileSystem from "expo-file-system";

const FILE_URI = FileSystem.documentDirectory + "items.txt";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Grocery");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const info = await FileSystem.getInfoAsync(FILE_URI);
    if (info.exists) {
      const content = await FileSystem.readAsStringAsync(FILE_URI);
      setItems(JSON.parse(content));
    }
  };

  const saveItems = async (data) => {
    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(data));
  };

  const addItem = async () => {
    if (!name) return;
    const updated = [...items, { name, category }];
    setItems(updated);
    setName("");
    await saveItems(updated);
  };

  const deleteItem = async (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    await saveItems(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home Tracker</Text>

      <TextInput
        placeholder="Enter item..."
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <View style={styles.categories}>
        {["Grocery", "Medicine", "Food"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              category === cat && styles.selected
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={addItem}>
        <Text style={styles.addText}>Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteItem(index)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f6f9" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  categoryBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0"
  },
  selected: {
    backgroundColor: "#4da6ff"
  },
  catText: { fontWeight: "600" },
  addBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20
  },
  addText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemCategory: { color: "#555" },
  delete: { color: "red", fontWeight: "bold" }
});
