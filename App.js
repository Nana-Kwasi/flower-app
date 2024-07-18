// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Badge } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './src/screens/welcome/welcome';
import HomeScreen from './src/screens/Home/Home';
import ShopScreen from './src/screens/Shop/Shop';
import CartScreen from './src/screens/Cart/Cart';
import ProfileScreen from './src/screens/Profile/Profile';
import { CartProvider,useCart } from './src/screens/CartContext/CartContext';
import ProductDetailScreen from './src/screens/ProductDetails/ProductDetail';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CartIconWithBadge() {
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <View>
      <Icon name="cart" type="material-community" />
      {totalQuantity > 0 && (
        <Badge
          value={totalQuantity}
          status="error"
          containerStyle={styles.badgeStyle}
        />
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Shop') {
            iconName = 'shopping';
          } else if (route.name === 'Cart') {
            return <CartIconWithBadge />;
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <Icon name={iconName} type="material-community" color={color} size={size} />;
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  badgeStyle: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
