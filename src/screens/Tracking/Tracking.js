import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firebase functions
import app from '../Authentication/Config/Config'; // Adjust the path if necessary

const Trackingscreen = ({ route }) => {
  const [checkoutData, setCheckoutData] = useState(null);
  const db = getFirestore(app); // Initialize Firestore

  // Safely access route.params and fallback to null if undefined
  const passedData = route?.params?.checkoutData || null;

  const saveCheckoutData = async (data) => {
    try {
      await AsyncStorage.setItem('checkoutData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving checkout data to AsyncStorage:', error);
    }
  };

  const loadCheckoutData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('checkoutData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCheckoutData(parsedData);
      }
    } catch (error) {
      console.error('Error loading checkout data from AsyncStorage:', error);
    }
  };

  // Function to retrieve order status from Firestore using order ID
  const fetchOrderStatus = async (orderId) => {
    try {
      const orderRef = doc(db, 'Checkouts', orderId); // Reference to the specific order document
      const orderSnapshot = await getDoc(orderRef); // Fetch the order data

      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        setCheckoutData(orderData); // Update the entire checkout data

        console.log('Order data retrieved from Firestore:', orderData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching order status from Firestore:', error);
    }
  };

  useEffect(() => {
    if (passedData) {
      setCheckoutData(passedData);
      saveCheckoutData(passedData);  // Save passed data
      fetchOrderStatus(passedData.orderId);  // Fetch order status using the passed order ID
    } else {
      loadCheckoutData();  // Load data from AsyncStorage if no data was passed
    }
  }, [passedData]);

  // Render cart items with individual cards and match order status
  const renderCartItem = ({ item }) => {
    const status = checkoutData?.orderDelivered ? 'delivered' 
      : checkoutData?.courierOnTheWay ? 'on the way' 
      : checkoutData?.orderProcessing ? 'in the kitchen' 
      : checkoutData?.orderReceived ? 'order placed' 
      : 'unknown';

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cartItemContainer}>
          <Text style={styles.cartItemName}>{item.name} (x{item.quantity})</Text>
          <Text style={styles.cartItemPrice}>Price: ${(item.price * item.quantity).toFixed(2)}</Text>
          <Text style={styles.statusText}>Order Status: {status}</Text> 
          <Text style={styles.instructionsText}>Delivery Instructions: {checkoutData?.deliveryDescription}</Text> 
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tracking Screen</Text>
      {checkoutData ? (
        <>
          <FlatList
            data={checkoutData.cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cartItemId}
          />
          <Text style={styles.totalText}>Total: ${checkoutData.totalPrice.toFixed(2)}</Text>
        </>
      ) : (
        <Text>Loading tracking details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemContainer: {
    marginVertical: 10,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  statusText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4CAF50', // Green color for status
  },
  instructionsText: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Trackingscreen;
