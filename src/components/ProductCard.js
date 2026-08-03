import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

const CONDITION_LABEL = {
  New: "Baru",
  Overstock: "Overstock",
  Returned: "Retur",
  Refurbished: "Refurbished",
  Damaged: "Cacat Kemasan",
};

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discountPct = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) *
      100,
  );
  const outOfStock = product.stockAvailable <= 0;

  return (
    <View style={styles.card}>
      {product.hasActiveFlashSale && (
        <View style={styles.flashBadge}>
          <Text style={styles.flashBadgeText}>⚡ FLASH SALE</Text>
        </View>
      )}

      <View style={styles.imageWrap}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{product.category}</Text>
          </View>
        )}
        {discountPct > 0 && (
          <View style={styles.sticker}>
            <Text style={styles.stickerText}>-{discountPct}%</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.condition}>
          {CONDITION_LABEL[product.condition]}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          {discountPct > 0 && (
            <Text style={styles.priceOriginal}>
              {formatRupiah(product.originalPrice)}
            </Text>
          )}
          <Text style={styles.priceCurrent}>
            {formatRupiah(product.currentPrice)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.stock, outOfStock && styles.stockEmpty]}>
            {outOfStock ? "Stok habis" : `Sisa ${product.stockAvailable}`}
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, outOfStock && styles.addBtnDisabled]}
            disabled={outOfStock}
            onPress={() => addItem(product)}
          >
            <Text style={styles.addBtnText}>+ Keranjang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FAF6EC",
    borderWidth: 2,
    borderColor: "#1F1B16",
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 6,
  },
  flashBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#F0B429",
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 2,
  },
  flashBadgeText: { fontSize: 11, fontWeight: "800", color: "#1F1B16" },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: "#D8C9AB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { justifyContent: "center", alignItems: "center" },
  imagePlaceholderText: {
    color: "#4A4139",
    fontSize: 12,
    textTransform: "uppercase",
  },
  sticker: {
    position: "absolute",
    bottom: -4,
    right: 6,
    backgroundColor: "#C23B22",
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: "-6deg" }],
  },
  stickerText: { color: "white", fontWeight: "800", fontSize: 15 },
  body: { padding: 12, gap: 5 },
  condition: {
    fontSize: 11,
    color: "#3F6C51",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: { fontSize: 15, fontWeight: "700", color: "#1F1B16" },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  priceOriginal: {
    fontSize: 12,
    color: "#4A4139",
    textDecorationLine: "line-through",
  },
  priceCurrent: { fontSize: 17, fontWeight: "700", color: "#1F1B16" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stock: { fontSize: 12, color: "#3F6C51", fontWeight: "700" },
  stockEmpty: { color: "#C23B22" },
  addBtn: {
    backgroundColor: "#1F1B16",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: "#E4D9C4", fontSize: 12, fontWeight: "700" },
});
