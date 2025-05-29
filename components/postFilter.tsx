import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  onFilter: (filters: {
    categories: string[];
    hashtags: string[];
    user: string;
    dateRange: { from: Date | null; to: Date | null };
  }) => void;
};

export default function PostFilter({ onFilter }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [user, setUser] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Añadir categoría
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([newCategory.trim()]);
      setNewCategory("");
    }
  };

  // Añadir hashtag
  const addHashtag = () => {
    const tag = hashtagInput.replace(/^#/, "").trim();
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput("");
    }
  };

  // Eliminar hashtag
  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((h) => h !== tag));
  };

  // Llamar a onFilter cuando cambian los filtros
  React.useEffect(() => {
    onFilter({ categories, hashtags, user, dateRange });
  }, [categories, hashtags, user, dateRange]);

  return (
    <View style={styles.container}>
      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {categories.map((cat) => (
          <View key={cat} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{cat}</Text>
          </View>
        ))}
        <TextInput
          style={styles.categoryInput}
          placeholder="Añadir categoría"
          value={newCategory}
          onChangeText={setNewCategory}
          onSubmitEditing={addCategory}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addCategory} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hashtags */}
      <View style={styles.row}>
        <TextInput
          style={styles.hashtagInput}
          placeholder="Añadir #hashtag"
          value={hashtagInput}
          onChangeText={setHashtagInput}
          onSubmitEditing={addHashtag}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addHashtag} style={styles.addBtn}>
          <Text style={styles.addBtnText}>#</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chipsRow}>
        {hashtags.map((tag) => (
          <View key={tag} style={styles.hashtagChip}>
            <Text style={styles.hashtagText}>#{tag}</Text>
            <TouchableOpacity onPress={() => removeHashtag(tag)}>
              <Text style={styles.removeBtn}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Usuario */}
      <TextInput
        style={styles.userInput}
        placeholder="Buscar por @usuario"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />

      {/* Fechas */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>
            {dateRange.from ? dateRange.from.toLocaleDateString() : "Desde"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>
            {dateRange.to ? dateRange.to.toLocaleDateString() : "Hasta"}
          </Text>
        </TouchableOpacity>
      </View>
      {showFromPicker && (
        <DateTimePicker
          value={dateRange.from || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setDateRange((r) => ({ ...r, from: date }));
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={dateRange.to || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setDateRange((r) => ({ ...r, to: date }));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff", borderRadius: 10, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  categoryChip: { backgroundColor: "#e0e7ff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 6 },
  categoryText: { color: "#2563eb", fontWeight: "bold" },
  categoryInput: { minWidth: 100, borderBottomWidth: 1, borderColor: "#cbd5e1", marginRight: 6, padding: 4 },
  addBtn: { backgroundColor: "#2563eb", borderRadius: 16, padding: 6, marginRight: 6 },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  hashtagInput: { flex: 1, borderBottomWidth: 1, borderColor: "#cbd5e1", marginRight: 6, padding: 4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  hashtagChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 4 },
  hashtagText: { color: "#2563eb", marginRight: 4 },
  removeBtn: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },
  userInput: { borderBottomWidth: 1, borderColor: "#cbd5e1", marginBottom: 8, padding: 4 },
  dateBtn: { flex: 1, backgroundColor: "#f3f4f6", borderRadius: 8, padding: 8, alignItems: "center", marginRight: 6 },
  dateBtnText: { color: "#2563eb" },
});