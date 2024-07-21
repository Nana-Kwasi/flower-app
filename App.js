// // App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Icon, Badge } from 'react-native-elements';
// import { View, StyleSheet } from 'react-native';
// import WelcomeScreen from './src/screens/welcome/welcome';
// import HomeScreen from './src/screens/Home/Home';
// import ShopScreen from './src/screens/Shop/Shop';
// import CartScreen from './src/screens/Cart/Cart';
// import ProfileScreen from './src/screens/Profile/Profile';
// import { CartProvider, useCart } from './src/screens/CartContext/CartContext';
// import ProductDetailScreen from './src/screens/ProductDetails/ProductDetail';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// function CartIconWithBadge() {
//   const { cartItems } = useCart();
//   const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   return (
//     <View>
//       <Icon name="cart" type="material-community" size={30} />
//       {totalQuantity > 0 && (
//         <Badge
//           value={totalQuantity}
//           status="error"
//           containerStyle={styles.badgeStyle}
//         />
//       )}
//     </View>
//   );
// }

// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           size = 50; // Increased icon size

//           if (route.name === 'Home') {
//             iconName = 'home';
//           } else if (route.name === 'Shop') {
//             iconName = 'shopping';
//           } else if (route.name === 'Cart') {
//             return <CartIconWithBadge />;
//           } else if (route.name === 'Profile') {
//             iconName = 'account';
//           }

//           return <Icon name={iconName} type="material-community" color={color} size={size} />;
//         },
//         tabBarLabelStyle: styles.tabBarLabelStyle,
//         tabBarStyle: styles.tabBarStyle,
//         tabBarActiveTintColor: '#2A9D8F',
//         tabBarInactiveTintColor: '#264653',
//         tabBarShowLabel: true,
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
//       <Tab.Screen name="Shop" component={ShopScreen} options={{ tabBarLabel: 'Shop' }} />
//       <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
//       <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
//     </Tab.Navigator>
//   );
// }

// const App = () => {
//   return (
//     <CartProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Welcome">
//           <Stack.Screen
//             name="Welcome"
//             component={WelcomeScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Main"
//             component={MainTabs}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="ProductDetail"
//             component={ProductDetailScreen}
//             options={{ headerShown: false }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </CartProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   badgeStyle: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//   },
//   tabBarStyle: {
//     height: 90, 
//     paddingBottom: 10,
//     paddingTop: 10,
//     marginBottom:40,
//     borderRadius:40
//   },
//   tabBarLabelStyle: {
//     fontSize: 14, 
//     fontWeight: '600',
//   },
// });



import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Badge } from 'react-native-elements';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import WelcomeScreen from './src/screens/welcome/welcome';
import HomeScreen from './src/screens/Home/Home';
import ShopScreen from './src/screens/Shop/Shop';
import CartScreen from './src/screens/Cart/Cart';
import ProfileScreen from './src/screens/Profile/Profile';
import { CartProvider, useCart } from './src/screens/CartContext/CartContext';
import ProductDetailScreen from './src/screens/ProductDetails/ProductDetail';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CartIconWithBadge() {
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <View style={styles.centralIcon}>
      <Icon name="shopping-bag" type="feather" size={24} color="#fff" />
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
          size = 30;
          

          if (route.name === 'Home') {
            return <Icon name="home" type="feather" color={color} size={size} />;
          } else if (route.name === 'Shop') {
            return <Icon name="shop" type="shopping-bag" color={color} size={size} />;
          } else if (route.name === 'Wishlist') {
            return <Icon name="heart" type="feather" color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <Icon name="user" type="feather" color={color} size={size} />;
          }
        },
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Cart" component={CartScreen} 
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} style={styles.centralButton}>
              <CartIconWithBadge />
            </TouchableOpacity>
          ),
        }} 
      />
      <Tab.Screen name="Wishlist" component={ShopScreen} />
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
  tabBarStyle: {
    height: 70, 
    width:"98%",
    backgroundColor: '#2C3539',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
    marginHorizontal: 5,
    marginBottom:10
  },
  tabBarLabelStyle: {
    fontSize: 14, 
    fontWeight: '600',
  },
  centralButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#fff',
  },
  centralIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#000302',
   
  },
});
// 9758A9