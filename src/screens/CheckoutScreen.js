import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useCart } from "../context/CartContext";
import { api } from "../api/client";
import { formatRupiah } from "../components/ProductCard";

export default function CheckoutScreen({ navigation }) {
  const { items, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!address.trim()) {
      setError("Alamat pengiriman wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shippingAddress: address,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      };
      const order = await api.checkout(payload);
      clearCart();
      navigation.navigate("Main", {
        screen: "Orders",
        params: { justPlacedOrderId: order.orderId }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Checkout</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Alamat Pengiriman</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={address}
        onChangeText={setAddress}
        multiline
        placeholder="Nama jalan, kota, kode pos..."
      />

      <View style={styles.summary}>
        {items.map(({ product, quantity }) => (
          <View key={product.id} style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {product.name} × {quantity}
            </Text>
            <Text style={styles.summaryText}>{formatRupiah(product.currentPrice * quantity)}</Text>
          </View>
        ))}
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatRupiah(totalPrice)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Memproses pesanan..." : "Buat Pesanan"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4D9C4" },
  title: { fontSize: 24, fontWeight: "800", color: "#1F1B16", marginBottom: 16 },
  error: { color: "#C23B22", fontWeight: "600", marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#1F1B16", marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 2,
    textAlignVertical: "top"
  },
  summary: {
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#B8A888",
    marginTop: 20,
    paddingVertical: 12
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryText: { fontSize: 13, color: "#1F1B16" },
  summaryTotal: { marginTop: 8 },
  totalLabel: { fontSize: 15 },
  totalValue: { fontSize: 17, fontWeight: "800" },
  button: { backgroundColor: "#C23B22", paddingVertical: 14, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontWeight: "700" }
});
