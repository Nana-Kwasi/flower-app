import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { useCart } from '../CartContext/CartContext';

const products = [
  {
    id: '1',
    name: 'Tulips Bouquet',
    price: '$68.50',
    description: 'Seven white-pinky Tulips with simple brown paper',
    category: 'Bouquet',
    image: require('../../../assets/pexels-pixabay-53141.jpg'),
  },
  {
    id: '2',
    name: 'Peony Bouquet',
    price: '$42.80',
    description: 'Three white Peony with four pink flowers and simple brown paper',
    category: 'Bouquet',
    image: require('../../../assets/pexels-lynda-sanchez-825238-2300713.jpg'),
  },
  {
    id: '3',
    name: 'Rose',
    price: '$8.55',
    description: 'One single branch of french red Rose',
    category: 'Branch',
    image: require('../../../assets/pexels-pixabay-236259.jpg'),
  },
  {
    id: '4',
    name: 'Daisy',
    price: '$9.15',
    description: 'A sprig of four or five red Daisy flowers',
    category: 'Branch',
    image: require('../../../assets/pexels-valeriiamiller-3392982.jpg'),
  },
  // Add more products with appropriate categories
];

const categories = ['All', 'Bouquet', 'Box', 'Branch', 'Houseplant'];

const ShopScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's shop!</Text>
        <Icon name="search" type="material" size={28} onPress={() => setIsSearchVisible(!isSearchVisible)} />
      </View>
      {isSearchVisible && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search for flowers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredProducts}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    height: 40, // Fixed height for consistency
    justifyContent: 'center', // Center the text vertically
  },
  selectedCategoryButton: {
    backgroundColor: '#CC6CE7',
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center', // Center the text horizontally
  },
  selectedCategoryText: {
    color: '#fff',
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
    color: '#CC6CE7',
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
  addToCartButton: {
    backgroundColor: '#CC6CE7',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
    width: '50%',
    marginTop: 20,
  },
  addToCartText: {
    color: 'white',
    fontSize: 13,
  },
});

export default ShopScreen;
