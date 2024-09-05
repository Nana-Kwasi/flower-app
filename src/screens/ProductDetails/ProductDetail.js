import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../CartContext/CartContext'; // Adjust the path according to your project structure
import { useFavorites } from '../Favorite/FavourateContext';
import { AirbnbRating } from 'react-native-ratings'; // Import the rating library
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements

const ProductDetailScreen = ({ route }) => {
  const { addToCart } = useCart();
  const { addToFavorites } = useFavorites();
  const { product } = route.params;
  const [rating, setRating] = useState(4.5);
  const [isAdding, setIsAdding] = useState(false);
  const navigation = useNavigation();

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product);
      Alert.alert('Success', 'Item has been added to cart successfully!');
      setIsAdding(false);
      navigation.navigate('Shop');
    }, 1500); // Simulate a network request with a timeout
  };

  const handleRatingCompleted = (newRating) => {
    setRating(newRating);
    // Here you could also send the rating to a server or store it
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={product.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(product)}>
          <Icon name="heart" type="feather" color="red" size={30} />
        </TouchableOpacity>
        <AirbnbRating
          count={5}
          defaultRating={rating}
          size={20}
          showRating={false}
          onFinishRating={handleRatingCompleted}
          starContainerStyle={styles.starContainer}
        />
        <Text style={styles.ratingText}>{rating.toFixed(1)} (83)</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Indulge in the simple elegance of our {product.name}, featuring {product.description.toLowerCase()}.
          Order now and experience the beauty of nature delivered straight to your door!
        </Text>
        <Text style={styles.price}>Price: {product.price}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={isAdding}>
          {isAdding ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.addToCartText}>Add To Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop:70
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  starContainer: {
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#ff6347',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
});

export default ProductDetailScreen;



