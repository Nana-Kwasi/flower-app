import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useCart } from '../CartContext/CartContext';
import * as Location from 'expo-location';  // Import the Expo Location module

const CartScreen = () => {
  const { cartItems, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fetchLocation = useCallback(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const geocodingResult = await reverseGeocode(location.coords);
      setLocationName(geocodingResult); // Update locationName state with geocoding result

      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = async (coords) => {
    try {
      const geocoding = await Location.reverseGeocodeAsync(coords);

      if (geocoding && geocoding.length > 0) {
        const result = geocoding[0];

        // Extract relevant information from the result
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

  useEffect(() => {
    fetchLocation();

    return () => {
      setLocationName(''); // Clear locationName state on component unmount
      setIsLoading(true);
    };
  }, [fetchLocation]);

  // Log location and locationName
  console.log('Location:', location);
  console.log('Location Name:', locationName);


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

  return (
    <View style={styles.container}>
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
              placeholder="Promo Code"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
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
            <Text  style={styles.summaryText1}>Location: {locationName.readableAddress}</Text>
          {/* <Text>City: {locationName.city}</Text>
          <Text>Country: {locationName.country}</Text>
          <Text>Region: {locationName.subregion}</Text> */}
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert('Checkout', 'Proceeding to checkout...')}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity> */}
        </>
      )}
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
  },
  promoButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  promoButtonApplied: {
    backgroundColor: '#ccc',
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
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    width:"40%",
    marginHorizontal:90
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
});

export default CartScreen;
