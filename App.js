import { useEffect } from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import AppNavigation from "./src/navigation";
import { registerForFlashSaleNotifications } from "./src/notifications/flashSaleNotifications";

export default function App() {
  useEffect(() => {
    // Minta izin notifikasi flash-sale begitu app dibuka.
    // Token yang dikembalikan bisa dikirim ke backend untuk push per-device (lihat README).
    registerForFlashSaleNotifications().then((token) => {
      if (token) console.log("Expo push token:", token);
    });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#E4D9C4" />
        <AppNavigation />
      </CartProvider>
    </AuthProvider>
  );
}
