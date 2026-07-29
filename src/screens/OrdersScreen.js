import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../api/client";
import { formatRupiah } from "../components/ProductCard";

export default function OrdersScreen({ route }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const justPlacedOrderId = route?.params?.justPlacedOrderId;

  useEffect(() => {
    api
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesanan Saya</Text>

      {justPlacedOrderId && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Pesanan #{justPlacedOrderId} berhasil dibuat!</Text>
        </View>
      )}

      {loading && <Text style={styles.status}>Memuat riwayat pesanan...</Text>}
      {error && <Text style={[styles.status, styles.statusError]}>{error}</Text>}

      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.orderId)}
        ListEmptyComponent={
          !loading && !error ? <Text style={styles.status}>Belum ada pesanan.</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>Pesanan #{item.orderId}</Text>
              <Text style={styles.statusBadge}>{item.status}</Text>
            </View>
            {item.items.map((line, idx) => (
              <Text key={idx} style={styles.lineItem}>
                {line.productName} × {line.quantity} — {formatRupiah(line.subtotal)}
              </Text>
            ))}
            <View style={styles.cardTotal}>
              <Text>Total</Text>
              <Text style={styles.cardTotalValue}>{formatRupiah(item.totalAmount)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4D9C4", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#1F1B16", marginBottom: 12 },
  successBanner: { backgroundColor: "#3F6C51", padding: 12, marginBottom: 16 },
  successText: { color: "white", fontWeight: "700" },
  status: { textAlign: "center", color: "#4A4139", marginTop: 30 },
  statusError: { color: "#C23B22", fontWeight: "600" },
  card: { backgroundColor: "#FAF6EC", borderWidth: 2, borderColor: "#1F1B16", padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardHeaderText: { fontWeight: "700" },
  statusBadge: {
    fontSize: 11,
    backgroundColor: "#F0B429",
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  lineItem: { fontSize: 13, color: "#4A4139", marginBottom: 4 },
  cardTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#B8A888",
    paddingTop: 8,
    marginTop: 8
  },
  cardTotalValue: { fontWeight: "700" }
});
