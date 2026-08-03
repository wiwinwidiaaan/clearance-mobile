import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

export default function CartScreen({ navigation }) {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  function handleCheckout() {
    navigation.navigate(isAuthenticated ? "Checkout" : "Login");
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>
          Keranjang masih kosong. Yuk cari barang murah.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keranjang</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.product.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>
                {formatRupiah(item.product.currentPrice)}
              </Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
              >
                <Text>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                disabled={item.quantity >= item.product.stockAvailable}
                onPress={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.product.id)}>
              <Text style={styles.remove}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatRupiah(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4D9C4", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F1B16",
    marginBottom: 16,
  },
  empty: { textAlign: "center", marginTop: 60, color: "#4A4139" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B8A888",
    gap: 8,
  },
  itemName: { fontWeight: "700", fontSize: 15, color: "#1F1B16" },
  itemPrice: { fontSize: 13, color: "#4A4139", marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  qtyText: { minWidth: 20, textAlign: "center", fontSize: 14 },
  remove: { color: "#C23B22", fontSize: 13, fontWeight: "700" },
  footer: {
    borderTopWidth: 2,
    borderTopColor: "#1F1B16",
    paddingTop: 16,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 20, fontWeight: "800" },
  checkoutBtn: {
    backgroundColor: "#C23B22",
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutBtnText: { color: "white", fontWeight: "700", fontSize: 15 },
});
