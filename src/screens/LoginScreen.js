import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigation.navigate("Main");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk</Text>
      <Text style={styles.subtitle}>Lanjutkan berburu barang murah.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Memproses..." : "Masuk"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.switchText}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4D9C4",
    padding: 24,
    justifyContent: "center",
  },
  title: { fontSize: 30, fontWeight: "800", color: "#1F1B16" },
  subtitle: { fontSize: 14, color: "#4A4139", marginBottom: 24 },
  error: { color: "#C23B22", fontWeight: "700", marginBottom: 12 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1B16",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#1F1B16",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 2,
  },
  button: {
    backgroundColor: "#1F1B16",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 2,
    marginTop: 24,
  },
  buttonText: { color: "#E4D9C4", fontWeight: "700" },
  switchText: {
    textAlign: "center",
    marginTop: 16,
    color: "#C23B22",
    fontWeight: "700",
  },
});
