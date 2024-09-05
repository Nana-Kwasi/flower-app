import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFavorites } from '../Favorite/FavourateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../CartContext/CartContext';

const FavoriteScreen = ({ navigation }) => {
  const { favoriteItems, removeFromFavorites, setFavoriteItems } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Function to load favorite items from AsyncStorage
  const loadFavoriteItems = async () => {
    try {
      const savedFavoriteItems = await AsyncStorage.getItem('@favoriteItems');
      if (savedFavoriteItems !== null) {
        setFavoriteItems(JSON.parse(savedFavoriteItems));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading favorite items:', error.message);
    }
  };

  // Function to save favorite items to AsyncStorage
  const saveFavoriteItems = async (updatedFavoriteItems) => {
    try {
      await AsyncStorage.setItem('@favoriteItems', JSON.stringify(updatedFavoriteItems));
    } catch (error) {
      console.error('Error saving favorite items:', error.message);
    }
  };

  // Call loadFavoriteItems when the component mounts
  useEffect(() => {
    loadFavoriteItems();
  }, []);

  // Save favorite items to AsyncStorage whenever favoriteItems changes
  useEffect(() => {
    if (!isLoading) {
      saveFavoriteItems(favoriteItems);
    }
  }, [favoriteItems, isLoading]);

  // Handle remove from favorites with confirmation
  const handleRemoveFromFavorites = (item) => {
    Alert.alert(
      'Remove Item',
      'Do you want to remove this item from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            removeFromFavorites(item);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddToCart = (product) => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product);
      Alert.alert('Success', 'Item has been added to cart successfully!');
      setIsAdding(false);
    
    }, 1500); // Simulate a network request with a timeout
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.removeFromFavoritesButton} onPress={() => handleRemoveFromFavorites(item)}>
          <Text style={styles.removeFromFavoritesText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)} disabled={isAdding}>
          {isAdding ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.addToCartText}>Add To Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteItems}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C4748',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 14,
    color: 'black',
  },
  removeFromFavoritesButton: {
    backgroundColor: '#d9534f',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
    alignSelf: 'flex-end',
  },
  removeFromFavoritesText: {
    color: 'white',
    fontSize: 13,
  },
  addToCartButton: {
    backgroundColor: '#3C4748',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
    width: '50%',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  addToCartText: {
    color: 'white',
    fontSize: 13,
  },
});

export default FavoriteScreen;
