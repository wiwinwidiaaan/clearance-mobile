import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import { triggerLocalFlashSaleDemo } from "../notifications/flashSaleNotifications";

const CATEGORIES = [
  "Semua",
  "Elektronik",
  "Fashion",
  "Rumah Tangga",
  "Olahraga",
];

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  async function loadProducts() {
    setError("");
    const params = {};
    if (category !== "Semua") params.category = category;
    if (search) params.search = search;

    try {
      const data = await api.getProducts(params);
      setProducts(data);

      // Demo: kalau ada produk flash-sale, picu notifikasi lokal contoh
      const flash = data.find((p) => p.hasActiveFlashSale);
      if (flash) {
        const pct = Math.round(
          ((flash.originalPrice - flash.currentPrice) / flash.originalPrice) *
            100,
        );
        triggerLocalFlashSaleDemo(flash.name, pct);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadProducts().finally(() => setLoading(false));
  }, [category, search]);

  async function onRefresh() {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroStamp}>EVERYTHING MUST GO</Text>
        <Text style={styles.heroTitle}>
          Barang bagus,{"\n"}harga sisa stok.
        </Text>
      </View>

      <View style={[styles.categoryRow, styles.categoryRowContent]}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={[styles.chipText, category === c && styles.chipTextActive]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.search}
        placeholder="Cari produk..."
        value={search}
        onChangeText={setSearch}
      />

      {loading && <Text style={styles.status}>Memuat produk...</Text>}
      {error && (
        <Text style={[styles.status, styles.statusError]}>
          Gagal memuat: {error}. Pastikan backend API sedang berjalan.
        </Text>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.status}>Tidak ada produk yang cocok.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4D9C4" },
  hero: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  heroStamp: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C23B22",
    borderWidth: 1.5,
    borderColor: "#C23B22",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F1B16",
    lineHeight: 34,
  },
  categoryRow: {
    minHeight: 48,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryRowContent: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: 4,
    gap: 5,
  },
  chip: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    paddingHorizontal: 3,
    paddingVertical: 7,
    borderRadius: 2,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: { backgroundColor: "#1F1B16" },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F1B16",
    textAlign: "center",
  },
  chipTextActive: { color: "#E4D9C4" },
  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 2,
    fontSize: 15,
  },
  status: { textAlign: "center", color: "#4A4139", padding: 20, fontSize: 14 },
  statusError: { color: "#C23B22", fontWeight: "700" },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
});
