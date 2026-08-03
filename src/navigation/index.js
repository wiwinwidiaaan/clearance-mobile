import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrdersScreen from "../screens/OrdersScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Ikon tab dengan badge notifikasi kecil di pojok kanan atas.
// - focused=true pakai varian "filled" biar beda jelas sama yang inactive (outline)
// - badge dibulatkan ke "9+" kalau lebih dari 9, biar nggak melebar
function TabIcon({ name, nameFocused, focused, color, badge }) {
  const iconName = focused ? nameFocused : name;
  const badgeLabel = badge > 9 ? "9+" : String(badge);

  return (
    <View style={styles.tabIconWrap}>
      <Ionicons name={iconName} size={24} color={color} />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text allowFontScaling={false} style={styles.badgeText}>
            {badgeLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

function CartIcon({ focused, color }) {
  const { totalItems } = useCart();
  return (
    <TabIcon
      name="cart-outline"
      nameFocused="cart"
      focused={focused}
      color={color}
      badge={totalItems}
    />
  );
}

// Visible from every tab — this is the login/register entry point that was
// previously only reachable by going through checkout. Shows "Masuk" when
// logged out, or the user's first name (tap to log out) when logged in.
function AccountHeaderButton() {
  const navigation = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <TouchableOpacity
        style={styles.accountBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text allowFontScaling={false} style={styles.accountBtnText}>
          Masuk
        </Text>
      </TouchableOpacity>
    );
  }

  const firstName = user?.fullName?.split(" ")[0] || "Akun";
  return (
    <TouchableOpacity style={styles.accountBtn} onPress={logout}>
      <Text allowFontScaling={false} style={styles.accountBtnText}>
        👤 {firstName} · Keluar
      </Text>
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#E4D9C4" },
        headerTintColor: "#1F1B16",
        headerTitleStyle: { fontSize: 18, fontWeight: "700" },
        headerRight: () => <AccountHeaderButton />,
        tabBarStyle: {
          backgroundColor: "#E4D9C4",
          borderTopColor: "#1F1B16",
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: "#C23B22",
        tabBarInactiveTintColor: "#4A4139",
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Katalog",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="storefront-outline"
              nameFocused="storefront"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Keranjang",
          tabBarIcon: ({ focused, color }) => (
            <CartIcon focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "Pesanan",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="cube-outline"
              nameFocused="cube"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: { fontSize: 13, fontWeight: "700" },
  tabIconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -9,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: "#C23B22",
    borderWidth: 1.5,
    borderColor: "#E4D9C4",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 12,
  },
  accountBtn: { marginRight: 14, paddingVertical: 4, paddingHorizontal: 4 },
  accountBtnText: { fontSize: 14, fontWeight: "700", color: "#1F1B16" },
});

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "#E4D9C4" },
          headerTintColor: "#1F1B16",
          headerTitleStyle: { fontSize: 18, fontWeight: "700" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true, title: "Masuk" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true, title: "Daftar" }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: true, title: "Checkout" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
