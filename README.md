# Clearance Mobile

Shopping app Android untuk platform e-commerce clearance sale — marketplace barang
surplus, retur, dan overstock, dengan notifikasi flash-sale. Dibangun dengan
React Native (Expo), terhubung ke [Clearance API](https://github.com/wiwinwidiaaan/clearance-api)
yang sama dengan [Clearance Web](https://github.com/wiwinwidiaaan/clearance-web).

## Tech Stack

- **React Native** + **Expo**
- **React Navigation** — bottom tabs + stack navigation
- **Expo Notifications** — push/local notification untuk flash-sale
- **AsyncStorage** — penyimpanan JWT token di device

## Fitur

- 🏬 Katalog produk dengan filter kategori & pencarian
- 🛒 Keranjang belanja & checkout terhubung ke backend
- 🔐 Register & login (JWT disimpan di AsyncStorage)
- 📋 Riwayat pesanan
- ⚡ Notifikasi flash-sale (demo lokal, siap dikembangkan jadi push notification sungguhan)

## Menjalankan Secara Lokal

```bash
npm install
npx expo start
```

Lalu:

- Scan QR code pakai app **Expo Go** di HP Android (paling gampang, tidak butuh Android Studio).
- Atau tekan `a` di terminal untuk buka di Android Emulator (butuh Android Studio ter-install).

Pastikan [Clearance API](https://github.com/wiwinwidiaaan/clearance-api) sudah jalan
supaya katalog produk bisa muncul.

### Penting soal alamat API

Di `app.json`, `apiBaseUrl` di-set ke `http://10.0.2.2:5000/api` (port default
`dotnet run` tanpa Docker).

- `10.0.2.2` adalah alamat khusus yang dipakai **Android Emulator** untuk mengakses
  `localhost` di komputer host. Kalau pakai emulator, biarkan host-nya seperti itu.
- Kalau backend dijalankan lewat `docker compose up` (biasanya di port `8080`), atau
  kalau port lokal Anda beda, sesuaikan angka port di `apiBaseUrl` supaya cocok.
- Kalau pakai **HP fisik** via Expo Go, ganti host ke alamat IP lokal komputer Anda,
  misalnya `http://192.168.1.5:5000/api` (cek dengan `ipconfig`/`ifconfig`), dan
  pastikan HP & komputer satu jaringan WiFi yang sama.

## Struktur Project

```
App.js                              -> entry point, minta izin notifikasi
src/
  api/client.js                     -> sama seperti web, tapi token disimpan di AsyncStorage
  context/                          -> AuthContext, CartContext (mirip web)
  components/                       -> ProductCard
  navigation/index.js               -> Bottom tabs (Katalog/Keranjang/Pesanan) + stack (Login/Register/Checkout)
  screens/                          -> HomeScreen, LoginScreen, RegisterScreen, CartScreen, CheckoutScreen, OrdersScreen
  notifications/flashSaleNotifications.js -> setup izin & trigger notifikasi flash-sale
```

## Soal Notifikasi Flash-Sale

Saat ini `App.js` minta izin notifikasi begitu app dibuka, dan `HomeScreen.js` memicu
notifikasi **lokal** contoh kalau ada produk dengan `hasActiveFlashSale: true` — ini demo
sederhana supaya Anda bisa lihat notifikasinya jalan tanpa perlu server push sungguhan.

**Untuk versi produksi nyata**, alurnya begini (teori):

1. Saat app pertama dibuka, `getExpoPushTokenAsync()` menghasilkan token unik per device.
2. Token itu dikirim ke backend (butuh endpoint baru, misalnya `POST /api/devices/register`)
   dan disimpan di tabel `DeviceTokens`.
3. Saat admin membuat `Discount` baru dengan `IsFlashSale = true`, backend memanggil
   Expo Push API (`https://exp.host/--/api/v2/push/send`) mengirim ke semua token yang tersimpan.
4. Notifikasi sampai ke HP user meskipun app sedang ditutup, karena dikirim lewat
   Firebase Cloud Messaging (Android) di baliknya — Expo yang mengurus koneksi ke FCM.

## Teori: Build APK/AAB Asli & Publish ke Play Store (Tidak Dieksekusi)

Karena project ini pakai Expo, cara build native-nya lewat **EAS Build** (layanan Expo yang
menjalankan Android SDK/Gradle di cloud, jadi Anda tidak perlu install Android Studio sendiri):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

Yang terjadi di baliknya:

1. EAS Build mengambil kode Anda, menjalankan `expo prebuild` (generate project Android native).
2. Build dijalankan pakai Android SDK + Gradle di server Expo, menghasilkan file `.aab`
   (Android App Bundle) — format yang sekarang wajib dipakai Play Store.
3. File itu perlu ditandatangani (signing) — EAS bisa generate keystore otomatis, atau Anda
   upload keystore sendiri.
4. Setelah `.aab` jadi, upload manual ke [Google Play Console](https://play.google.com/console)
   (perlu akun developer, ~$25 sekali bayar), isi metadata (deskripsi, screenshot, privacy
   policy, content rating), lalu submit untuk direview Google.

Alternatif kalau tidak mau pakai Expo: build native pakai `react-native` CLI murni,
lalu jalankan `./gradlew bundleRelease` langsung di komputer sendiri dengan Android SDK
ter-install — ini yang dimaksud "Android SDK" di deskripsi project awal. Expo dengan EAS
Build pada dasarnya melakukan hal yang sama, hanya prosesnya di-otomatisasi di cloud.

## Project Terkait

- **[Clearance API](https://github.com/wiwinwidiaaan/clearance-api)** — backend ASP.NET Core
- **[Clearance Web](https://github.com/wiwinwidiaaan/clearance-web)** — storefront React

## Lisensi

MIT — bebas dipakai sebagai referensi untuk project Anda sendiri.
