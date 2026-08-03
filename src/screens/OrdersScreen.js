import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../api/client";
import { formatRupiah } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

// Backend ngirim status dalam bahasa Inggris (nama enum C#), diterjemahkan
// di sini biar konsisten sama sisa UI yang berbahasa Indonesia. Warnanya
// dibedain per tahap biar progres pesanan kebaca sekilas.
const STATUS_LABELS = {
  Pending: "Menunggu Konfirmasi",
  Paid: "Sudah Dibayar",
  Processing: "Diproses",
  Shipped: "Dikirim",
  Delivered: "Selesai",
  Cancelled: "Dibatalkan",
};

const STATUS_COLORS = {
  Pending: "#F0B429",
  Paid: "#F0B429",
  Processing: "#4A90D9",
  Shipped: "#4A90D9",
  Delivered: "#3F6C51",
  Cancelled: "#C23B22",
};

export default function OrdersScreen({ route }) {
  const navigation = useNavigation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const justPlacedOrderId = route?.params?.justPlacedOrderId;

  useFocusEffect(
    useCallback(() => {
      if (authLoading) return;

      // Don't even call the API if we know there's no token — /api/orders
      // requires auth, and showing a raw "server error" for that is
      // confusing. Show a clear login prompt instead.
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      api
        .getMyOrders()
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [isAuthenticated, authLoading]),
  );

  if (!authLoading && !isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pesanan Saya</Text>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Masuk dulu untuk melihat riwayat pesananmu.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginBtnText}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesanan Saya</Text>

      {justPlacedOrderId && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            Pesanan #{justPlacedOrderId} berhasil dibuat!
          </Text>
        </View>
      )}

      {loading && <Text style={styles.status}>Memuat riwayat pesanan...</Text>}
      {error && (
        <Text style={[styles.status, styles.statusError]}>{error}</Text>
      )}

      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.orderId)}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.status}>Belum ada pesanan.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>Pesanan #{item.orderId}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_COLORS[item.status] || "#B8A888" },
                ]}
              >
                {STATUS_LABELS[item.status] || item.status}
              </Text>
            </View>
            {item.items.map((line, idx) => (
              <Text key={idx} style={styles.lineItem}>
                {line.productName} × {line.quantity} —{" "}
                {formatRupiah(line.subtotal)}
              </Text>
            ))}
            <View style={styles.cardTotal}>
              <Text style={styles.cardTotalLabel}>Total</Text>
              <Text style={styles.cardTotalValue}>
                {formatRupiah(item.totalAmount)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4D9C4", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F1B16",
    marginBottom: 12,
  },
  successBanner: { backgroundColor: "#3F6C51", padding: 12, marginBottom: 16 },
  successText: { color: "white", fontWeight: "700", fontSize: 14 },
  status: {
    textAlign: "center",
    color: "#4A4139",
    marginTop: 30,
    fontSize: 14,
  },
  statusError: { color: "#C23B22", fontWeight: "700" },
  loginPrompt: { alignItems: "center", marginTop: 60, gap: 16 },
  loginPromptText: { fontSize: 15, color: "#4A4139", textAlign: "center" },
  loginBtn: {
    backgroundColor: "#C23B22",
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  loginBtnText: { color: "white", fontWeight: "700", fontSize: 15 },
  card: {
    backgroundColor: "#FAF6EC",
    borderWidth: 2,
    borderColor: "#1F1B16",
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardHeaderText: { fontWeight: "700", fontSize: 15 },
  statusBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lineItem: { fontSize: 14, color: "#4A4139", marginBottom: 4 },
  cardTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#B8A888",
    paddingTop: 8,
    marginTop: 8,
  },
  cardTotalLabel: { fontSize: 14 },
  cardTotalValue: { fontWeight: "700", fontSize: 15 },
});
