import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useCart } from '../CartContext/CartContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 
import app from '../Authentication/Config/Config';

const CartScreen = () => {
  const { cartItems, increaseQuantity, setCartItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null); // State for username
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [name, setName] = useState(''); // State for name
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submit button loading
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false); // State for checkout button loading


  const validatePassword = () => {
    if (password.length < 6) {
      Alert.alert('Password Error', 'Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };
  const auth = getAuth(app);
  const db = getFirestore(app);

   const generateUniqueId = () => {
        return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
    };

    const handleCustomerSubmit = async (userData) => {
      const newCustomer = {
        ...userData,
        id: generateUniqueId(),
      };
    
      console.log(newCustomer);
    
      try {
        await setDoc(doc(db, "Customer", newCustomer.id), newCustomer);
        await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        console.log('Successfully registered as a customer:', userData.email);
        await AsyncStorage.setItem('username', userData.username);
        await AsyncStorage.setItem('email', userData.email);
        await AsyncStorage.setItem('phoneNumber', userData.phonenumber);
      } catch (error) {
        console.error('Error during registration:', error.message);
        alert('Registration failed: ' + error.message);
      }
    };
    
  
  
 
  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from the cart?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: () => {
              const updatedCartItems = cartItems.filter(cartItem => cartItem.cartItemId !== item.cartItemId);
              setCartItems(updatedCartItems);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const updatedCartItems = cartItems.map(cartItem => 
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
    }
  };
  
  // Function to load cart items from AsyncStorage
  const loadCartItems = async () => {
    try {
      const savedCartItems = await AsyncStorage.getItem('@cartItems');
      if (savedCartItems !== null) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } catch (error) {
      console.error('Error loading cart items:', error.message);
    }
  };

  // Function to save cart items to AsyncStorage
  const saveCartItems = async (updatedCartItems) => {
    try {
      await AsyncStorage.setItem('@cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error saving cart items:', error.message);
    }
  };

  // Call loadCartItems when the component mounts
  useEffect(() => {
    loadCartItems();
  }, []);

  // Save cart items to AsyncStorage whenever cartItems changes
  useEffect(() => {
    saveCartItems(cartItems);
  }, [cartItems]);
  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 10000, // Increase timeout
      });
      setLocation(location);

      const geocodingResult = await reverseGeocode(location.coords);
      setLocationName(geocodingResult);

      await AsyncStorage.setItem('location', JSON.stringify(location));
      await AsyncStorage.setItem('locationName', JSON.stringify(geocodingResult));

      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Error getting location. Please try again.', [
        {
          text: 'Reload',
          onPress: fetchLocation,
        },
      ]);
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = async (coords) => {
    try {
      const geocoding = await Location.reverseGeocodeAsync(coords);

      if (geocoding && geocoding.length > 0) {
        const result = geocoding[0];
        const { city, country, region } = result;
        const readableAddress = [city, region, country].filter(Boolean).join(', ');

        return {
          city: city || 'Unknown',
          country: country || 'Unknown',
          name: result.name || 'Unknown',
          subregion: result.subregion || 'Unknown',
          readableAddress: readableAddress || 'Unknown Location',
        };
      } else {
        console.log('Geocoding result is empty.');
        return {
          city: 'Unknown',
          country: 'Unknown',
          name: 'Unknown',
          subregion: 'Unknown',
          readableAddress: 'Unknown Location',
        };
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      return {
        city: 'Error',
        country: 'Error',
        name: 'Error',
        subregion: 'Error',
        readableAddress: 'Error getting location name',
      };
    }
  };

  const loadStoredData = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('location');
      const storedLocationName = await AsyncStorage.getItem('locationName');

      if (storedLocation && storedLocationName) {
        setLocation(JSON.parse(storedLocation));
        setLocationName(JSON.parse(storedLocationName));
        setIsLoading(false);
      } else {
        fetchLocation();
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      fetchLocation();
    }
  };

  useEffect(() => {
    loadStoredData();

    return () => {
      setLocationName('');
      setIsLoading(true);
    };
  }, [fetchLocation]);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemAttributes}>Size: {item.size}  Color: {item.color}</Text>
        <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return (getTotalPrice() * 0.1).toFixed(2);
  };

  const handleApplyPromo = () => {
    if (promoCode === 'DISCOUNT10') {
      setPromoApplied(true);
      Alert.alert('Promo Applied', 'You have successfully applied the promo code!');
    } else {
      Alert.alert('Invalid Promo', 'The promo code you entered is not valid.');
    }
  };
  

  const handleCheckoutSubmit = async () => {
    if (!username) {
      setModalVisible(true);
      return;
    }
    setIsCheckoutSubmitting(true);
    const cartData = {
      cartItems,
      totalPrice: getTotalPrice() + parseFloat(getDeliveryFee()),
      deliveryFee: parseFloat(getDeliveryFee()),
      location: locationName,
      checkoutTime: new Date().toISOString(),
      customerData: {
        name: username,  // Use the loaded username
        email,           // Use the loaded email
        phoneNumber,     // Use the loaded phone number
      }
    };
  
    try {
      await setDoc(doc(db, "Checkouts", generateUniqueId()), cartData);
      console.log('Checkout data successfully saved to Firebase:', cartData);
      Alert.alert('Checkout', 'Checkout data successfully saved.');
      clearCart(); // Clear the cart data here
    } catch (error) {
      console.error('Error saving checkout data:', error.message);
      Alert.alert('Checkout Error', 'There was an error processing your checkout. Please try again.');
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };
  
  
  const clearCart = () => {
    setCartItems([]);
    // Optionally, you can also clear other cart-related state variables if needed
  };
  
  // Function to load username from AsyncStorage
 const loadUserData = async () => {
  try {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
    
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
  } catch (error) {
    console.error('Error loading user data:', error.message);
  }
};

useEffect(() => {
  loadUserData();
}, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => setModalVisible(true)}>
          <Icon name="user" size={60} color="#000" />
          {username && <Text style={styles.usernameText}>{username}</Text>}
        </TouchableOpacity>
      </View>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cartItemId}
            contentContainerStyle={styles.cartList}
          />
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter Promo Code"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
              placeholderTextColor={"black"}
            />
            <TouchableOpacity
              style={[styles.promoButton, promoApplied && styles.promoButtonApplied]}
              onPress={handleApplyPromo}
              disabled={promoApplied}
            >
              <Text style={styles.promoButtonText}>{promoApplied ? 'Applied' : 'Apply'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Subtotal: ${getTotalPrice().toFixed(2)}</Text>
            <Text style={styles.summaryText}>Delivery Fee: ${getDeliveryFee()}</Text>
            <Text style={styles.summaryTotal}>Total: ${(getTotalPrice() + parseFloat(getDeliveryFee())).toFixed(2)}</Text>
            {locationName && (
            <View style={styles.locationContainer}>
              <Text style={styles.summaryText}>Delivery Location: {locationName.readableAddress}</Text>
            </View>
          )}
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckoutSubmit} disabled={isCheckoutSubmitting}>
  {isCheckoutSubmitting ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text style={styles.checkoutButtonText}>Checkout</Text>
  )}
</TouchableOpacity>

          {/* <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
            <Text style={styles.clearCartButtonText}>Clear Cart</Text>
          </TouchableOpacity> */}
        </>
      )}

      {/* Modal for user details */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeaderText}>Sign Up</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={"black"}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"black"}
            keyboardType='email-address'
          />
         <TextInput
  style={[styles.modalInput, password.length < 6 && styles.invalidInput]}
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  placeholderTextColor={"black"}
/>

          <TextInput
            style={styles.modalInput}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor={"black"}
            keyboardType='numeric'
          />
                 <TouchableOpacity
            style={[styles.modalButton, password.length < 6 && styles.disabledButton]}
            onPress={() => {
              setUsername(name);
              setEmail(email);
              setPassword(password);
              setPhoneNumber(phoneNumber);
              setModalVisible(false);
              handleCustomerSubmit({ username: name, email: email, phonenumber: phoneNumber, password: password });
            }}
            disabled={password.length < 6}
          >
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: 'white',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#3C4748',
    borderRadius: 20,
    alignItems: 'center',
    width: '40%',
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalHeaderText:{
fontSize:30,
fontWeight:"bold",
marginBottom:20

  },
  usernameText: {
    marginLeft: 8,
    fontSize: 18,
    marginHorizontal:20
  },
  cartList: {
    paddingVertical: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemAttributes: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    color:"red",
    fontWeight:'bold'
  },
  promoButton: {
    backgroundColor: '#000302',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  promoButtonApplied: {
    backgroundColor: '#000302',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
    color:'#70457C'
  },
  summaryText1: {
    fontSize: 16,
    marginVertical: 5,
    color:'#70457C'
  },

  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color:'#70457C'
  },
  checkoutButton: {
    backgroundColor: '#3C4748',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    width:"40%",
    marginHorizontal:100,
    marginBottom:130
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  clearCartButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width:"30%"
  },
  clearCartText: {
    color: 'salmon',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    padding: 10,
    
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default CartScreen;
