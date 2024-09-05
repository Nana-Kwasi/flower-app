import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Trackingscreen = ({ route }) => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [orderStatus, setOrderStatus] = useState(''); 

  // Safely access route.params and fallback to an empty object if undefined
  const passedData = route?.params?.checkoutData || null;

  const saveCheckoutData = async (data) => {
    try {
      await AsyncStorage.setItem('checkoutData', JSON.stringify(data));
      console.log('Checkout data saved to AsyncStorage:', data);
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
        setOrderStatus(parsedData.orderStatus);  // Load order status
        console.log('Loaded checkout data from AsyncStorage:', parsedData);
      }
    } catch (error) {
      console.error('Error loading checkout data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (passedData) {
      setCheckoutData(passedData);
      setOrderStatus(passedData.orderStatus); // Set initial order status
      saveCheckoutData(passedData);  // Save the passed data
    } else {
      loadCheckoutData();  // Load data from AsyncStorage if no data was passed
    }
  }, [passedData]);

  const getProgress = () => {
    const status = orderStatus ? orderStatus.toLowerCase() : '';  // Fallback to an empty string if orderStatus is undefined
    switch (status) {
      case 'order placed':
        return 1;
      case 'in the kitchen':
        return 2;
      case 'on the way':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;  // Return 0 for undefined or unrecognized statuses
    }
  };
  
  const renderProgressBar = () => {
    const progress = getProgress();
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, progress >= 1 && styles.progressStepCompleted]}>
          <Text>Order Placed</Text>
        </View>
        <View style={[styles.progressStep, progress >= 2 && styles.progressStepCompleted]}>
          <Text>In the Kitchen</Text>
        </View>
        <View style={[styles.progressStep, progress >= 3 && styles.progressStepCompleted]}>
          <Text>On the Way</Text>
        </View>
        <View style={[styles.progressStep, progress >= 4 && styles.progressStepCompleted]}>
          <Text>Delivered</Text>
        </View>
      </View>
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Text style={styles.cartItemName}>{item.name} (x{item.quantity})</Text>
      <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tracking Screen</Text>
      {checkoutData ? (
        <>
          {renderProgressBar()}  
          <Text style={styles.sectionTitle}>Delivery Location:</Text>
          <Text>{checkoutData.location.readableAddress}</Text>
          <Text style={styles.sectionTitle}>Delivery Instructions:</Text>
          <Text>{checkoutData.deliveryDescription}</Text>
          <Text style={styles.sectionTitle}>Items Ordered:</Text>
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
  sectionTitle: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  cartItemContainer: {
    marginVertical: 10,
  },
  cartItemName: {
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#888',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  progressStep: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  progressStepCompleted: {
    backgroundColor: '#4CAF50',
  },
});

export default Trackingscreen;
