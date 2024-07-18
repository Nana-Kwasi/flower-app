import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../CartContext/CartContext';
import * as Location from 'expo-location';  // Import the Expo Location module

const { width: screenWidth } = Dimensions.get('window');

const imagePaths = {
  diy: require('../../../assets/pexels-cottonbro-4499854.jpg'),
  box: require('../../../assets/pexels-dmitriy-yarovoy-191560-969832.jpg'),
  bouquet: require('../../../assets/manel-sean-v9OOmheGCkc-unsplash.jpg'),
  branch: require('../../../assets/pexels-cottonbro-4272611.jpg'),
  houseplants: require('../../../assets/pexels-cottonbro-4273432.jpg'),
  wedding: require('../../../assets/pexels-cottonbro-4499866.jpg'),
  redTulip: require('../../../assets/pexels-inspiredimages-133181.jpg'),
  rose: require('../../../assets/pexels-pixabay-53141.jpg'),
  daisy: require('../../../assets/pexels-lynda-sanchez-825238-2300713.jpg'),
  bestSeller1: require('../../../assets/pexels-pixabay-236259.jpg'),
  bestSeller2: require('../../../assets/pexels-valeriiamiller-3392982.jpg'),
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




  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchText('');
  };

  const filteredItems = () => {
    if (!searchText) return null;
    const allItems = [
      { id: '1', name: 'Red Tulip', price: '$21.99', image: imagePaths.redTulip, type: 'product', description: 'Beautiful red tulip.' },
      { id: '2', name: 'Rose', price: '$8.55', image: imagePaths.rose, type: 'product', description: 'Single red rose.' },
      { id: '3', name: 'Daisy', price: '$9.15', image: imagePaths.daisy, type: 'product', description: 'A bunch of daisies.' },
      { id: '4', name: 'Best Seller 1', price: '$9.15', image: imagePaths.bestSeller1, type: 'product', description: 'Popular bouquet.' },
      { id: '5', name: 'Best Seller 2', price: '$8.55', image: imagePaths.bestSeller2, type: 'product', description: 'Another popular choice.' },
    ];
    return allItems.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Nana!</Text>
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
                source={imagePaths.diy}
                style={styles.diyImage}
              />
              <View style={styles.diyTextContainer}>
                <Text style={styles.diyTitle}>Model Flower Bouquets</Text>
                <Text style={styles.diySubtitle}>Design Your Own Custom Bouquet</Text>
                <Text style={styles.diyDescription}>
                  Choose any color, any model, and any flower to create your favorite.
                </Text>
                <TouchableOpacity style={styles.diyButton}>
                  <Text style={styles.diyButtonText}>Make your own</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {['box', 'bouquet', 'branch', 'houseplants', 'wedding'].map((category, index) => (
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
                  { id: '1', name: 'Red Tulip', price: '$21.99', image: imagePaths.redTulip, description: 'Beautiful red tulip.' },
                  { id: '2', name: 'Rose', price: '$8.55', image: imagePaths.rose, description: 'Single red rose.' },
                  { id: '3', name: 'Daisy', price: '$9.15', image: imagePaths.daisy, description: 'A bunch of daisies.' },
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
                  { id: '4', name: 'Best Seller 1', price: '$8.55', image: imagePaths.bestSeller1, description: 'Popular bouquet.' },
                  { id: '5', name: 'Best Seller 2', price: '$8.55',image: imagePaths.bestSeller2, description: 'Another popular choice.' },
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
    width: 60,
    height: 60,
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
