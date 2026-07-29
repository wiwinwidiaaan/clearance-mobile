import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useCart } from "../context/CartContext";

import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrdersScreen from "../screens/OrdersScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CartIcon() {
  const { totalItems } = useCart();
  return <Text>🛒{totalItems > 0 ? ` ${totalItems}` : ""}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#E4D9C4" },
        headerTintColor: "#1F1B16",
        tabBarStyle: { backgroundColor: "#E4D9C4", borderTopColor: "#1F1B16" },
        tabBarActiveTintColor: "#C23B22",
        tabBarInactiveTintColor: "#4A4139"
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Katalog", tabBarIcon: () => <Text>🏬</Text> }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Keranjang", tabBarIcon: CartIcon }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Pesanan", tabBarIcon: () => <Text>📦</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: "Masuk" }} />
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
