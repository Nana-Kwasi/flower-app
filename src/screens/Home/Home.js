import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../CartContext/CartContext';
import * as Location from 'expo-location';  // Import the Expo Location module

const { width: screenWidth } = Dimensions.get('window');

  const imagePaths = {
    pizza: require('../../../assets/An excellent NO YEAST Pizza Dough - super quick!.jpg'),
    burger: require('../../../assets/Halloumi Burgers.jpg'),
    pasta: require('../../../assets/23 Easy Shrimp Pasta Recipes to Try Tonight.jpg'),
    salad: require('../../../assets/Buffalo Chicken Chopped Salad.jpg'),
    sushi: require('../../../assets/2e5f115e-1ec1-4b10-b7d6-cb9cec973d0a.jpg'),
    dessert: require('../../../assets/The Best Donut Shop In Every State.jpg'),
    fries: require('../../../assets/34e3a7df-39ff-41ff-8797-794a46dd02fc.jpg'),
    steak: require('../../../assets/34e3a7df-39ff-41ff-8797-794a46dd02fc.jpg'),
    iceCream: require('../../../assets/Pink Hot Chocolate.jpg'),
    bestSeller1: require('../../../assets/Pink Hot Chocolate.jpg'),
    bestSeller2: require('../../../assets/34e3a7df-39ff-41ff-8797-794a46dd02fc.jpg'),
  };


const HomeScreen = () => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [searchText, setSearchText] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
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
      setLocationName(''); 
      setIsLoading(true);
    };
  }, [fetchLocation]);

 
  // console.log('Location:', location);
  // console.log('Location Name:', locationName);




  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchText('');
  };

  const filteredItems = () => {
    if (!searchText) return null;
    const allItems = [
      { id: '1', name: 'Pizza', price: '$12.99', image: imagePaths.pizza, type: 'product', description: 'Delicious cheesy pizza.' },
      { id: '2', name: 'Burger', price: '$8.55', image: imagePaths.burger, type: 'product', description: 'Juicy beef burger.' },
      { id: '3', name: 'Pasta', price: '$9.15', image: imagePaths.pasta, type: 'product', description: 'Creamy Alfredo pasta.' },
      { id: '4', name: 'Sushi', price: '$14.55', image: imagePaths.sushi, type: 'product', description: 'Fresh sushi rolls.' },
      { id: '5', name: 'Ice Cream', price: '$5.99', image: imagePaths.iceCream, type: 'product', description: 'Cold and creamy ice cream.' },
    ];
    return allItems.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  };
  
  const handleCategoryPress = (category) => {
    navigation.navigate('Shop', { category });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Samuel !</Text>
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for flowers..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity onPress={handleSearchToggle} style={styles.searchButton}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleSearchToggle}>
              <Icon name="search" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {searchText ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
              {filteredItems().map((item, index) => (
                <View key={index} style={styles.productContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                    <Image
                      source={item.image}
                      style={styles.productImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.price && <Text style={styles.productPrice}>{item.price}</Text>}
                  <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                    <Icon name="add" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <>
            <View style={styles.diyContainer}>
              <Image
                source={imagePaths.fries}
                style={styles.diyImage}
              />
              <View style={styles.diyTextContainer}>
                <Text style={styles.diyTitle}>Local Restaurant </Text>
                <Text style={styles.diySubtitle}>Order something special</Text>
                <Text style={styles.diyDescription}>
                  Search for any food and get it delivered at your door post.
                </Text>
                <TouchableOpacity style={styles.diyButton}>
                  <Text style={styles.diyButtonText}>Place your order</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {['pizza', 'burger', 'pasta', 'salad', 'sushi', 'dessert'].map((category, index) => (
                  <TouchableOpacity key={index} style={styles.categoryContainer} onPress={() => handleCategoryPress(category)}>
                    <Image
                      source={imagePaths[category]}
                      style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fresh Blooms</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
              {[
    { id: '1', name: 'Pizza', price: '$12.99', image: imagePaths.pizza, description: 'Delicious cheesy pizza.' },
    { id: '2', name: 'Burger', price: '$8.55', image: imagePaths.burger, description: 'Juicy beef burger.' },
    { id: '3', name: 'Pasta', price: '$9.15', image: imagePaths.pasta, description: 'Creamy Alfredo pasta.' },
  ].map((product, index) => (
    <View key={index} style={styles.productContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product })}>
        <Image
          source={product.image}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
        <Icon name="add" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bestsellers</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
              {[
    { id: '4', name: 'Sushi', price: '$14.55', image: imagePaths.sushi, description: 'Fresh sushi rolls.' },
    { id: '5', name: 'Ice Cream', price: '$5.99', image: imagePaths.iceCream, description: 'Cold and creamy ice cream.' },
  ].map((product, index) => (
    <View key={index} style={styles.productContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product })}>
        <Image
          source={product.image}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
        <Icon name="add" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
      {/* <View style={styles.bottomNavigation}>
        {['home', 'shopping-cart', 'person', 'favorite'].map((icon, index) => (
          <Icon key={index} name={icon} size={28} />
        ))}
      </View> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 8,
  },
  diyContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
    borderRadius: 10,
  },
  diyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  diyTextContainer: {
    flex: 1,
  },
  diyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  diySubtitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  diyDescription: {
    fontSize: 14,
    color: '#666',
  },
  diyButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  diyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImage: {
    width: 90,
    height: 90,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
  },
  productScroll: {
    flexDirection: 'row',
  },
  productContainer: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default HomeScreen;
