import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Konfigurasi bagaimana notifikasi tampil saat app sedang dibuka (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

// Minta izin notifikasi ke user & siapkan channel Android
export async function registerForFlashSaleNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("flash-sale", {
      name: "Flash Sale",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#C23B22"
    });
  }

  if (!Device.isDevice) {
    console.log("Push notification butuh perangkat fisik/emulator, bukan simulator biasa.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Izin notifikasi ditolak user.");
    return null;
  }

  // Token ini yang nanti dikirim & disimpan di backend supaya server bisa
  // push notifikasi ke device spesifik ini (lihat LEARNING-NOTES di paket ini).
  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

// Contoh trigger notifikasi lokal untuk testing tanpa backend push server
export async function triggerLocalFlashSaleDemo(productName, discountPct) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚡ Flash Sale dimulai!",
      body: `${productName} diskon ${discountPct}% — stok terbatas, buruan!`,
      sound: true
    },
    trigger: { seconds: 2 }
  });
}
