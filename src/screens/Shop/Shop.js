import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { useCart } from '../CartContext/CartContext';
import { useFavorites } from '../Favorite/FavourateContext';


const products = [
  // Fast Food
  {
    id: '1',
    name: 'Pizza',
    price: '$12.99',
    description: 'Delicious cheesy pizza',
    category: 'Fast Food',
    image: require('../../../assets/An excellent NO YEAST Pizza Dough - super quick!.jpg'),
  },
  {
    id: '2',
    name: 'Burger',
    price: '$8.55',
    description: 'Juicy beef burger',
    category: 'Fast Food',
    image: require('../../../assets/Halloumi Burgers.jpg'),
  },
  {
    id: '3',
    name: 'Fries',
    price: '$3.99',
    description: 'Crispy golden fries',
    category: 'Fast Food',
    image: require('../../../assets/Fried Brown Rice_ With Beef, Chicken, Pork Or Shrimp! - The Woks of Life.jpg'),  },
  {
    id: '4',
    name: 'Hot Dog',
    price: '$5.49',
    description: 'Grilled hot dog with ketchup and mustard',
    category: 'Fast Food',
    image: require('../../../assets/47 Wild-Slash-Brilliant Ways To Cook & Eat Hot Dogs.jpg'),  },
  {
    id: '5',
    name: 'Chicken Nuggets',
    price: '$6.99',
    description: 'Crunchy chicken nuggets',
    category: 'Fast Food',
    image: require('../../../assets/Air Fryer Chicken Nuggets {popular recipe} _ Kitchen At Hoskins.jpg'),  },
  {
    id: '6',
    name: 'Tacos',
    price: '$9.99',
    description: 'Soft tacos with beef filling',
    category: 'Fast Food',
    image: require('../../../assets/Authentic Taco de Calle [1_25 Hours].jpg'),  },
  {
    id: '7',
    name: 'Grilled Cheese Sandwich',
    price: '$4.99',
    description: 'Melted cheese sandwich',
    category: 'Fast Food',
    image: require('../../../assets/40 Dinner Ideas for Tonight (+ Easy Recipes).jpg'),  },
  {
    id: '8',
    name: 'Onion Rings',
    price: '$3.99',
    description: 'Crispy onion rings',
    category: 'Fast Food',
    image: require('../../../assets/Onion rings o Anelli di Cipolla NON fritti - Ricette Vegane.jpg'),  },
  {
    id: '9',
    name: 'Fried Chicken',
    price: '$10.50',
    description: 'Crispy fried chicken',
    category: 'Fast Food',
    image: require('../../../assets/5 Recipes to Make This Week - Asili Glam.jpg'),  },
  {
    id: '10',
    name: 'Burrito',
    price: '$9.99',
    description: 'Burrito with beans and beef',
    category: 'Fast Food',
    image: require('../../../assets/807699f1-f81e-44ba-9930-301baa7518e5.jpg'),  },
 ,

  // Local Dishes
  {
    id: '16',
    name: 'Fufu',
    price: '$14.55',
    description: 'Fufu with goat soup',
    category: 'Local Dishes',
    image: require('../../../assets/fufu.jpg'),
  },
  {
    id: '17',
    name: 'Beans',
    price: '$13.99',
    description: 'Beans with kokoo',
    category: 'Local Dishes',
    image: require('../../../assets/Nigerian beans porridge.jpg'),  },
  {
    id: '18',
    name: 'Boiled yam',
    price: '$10.50',
    description: 'Boiled yam with tomatoes stew',
    category: 'Local Dishes',
    image: require('../../../assets/yam.jpg'),  },
  {
    id: '19',
    name: 'Boiled plantain',
    price: '$12.00',
    description: 'boild plantain with kontomire stew',
    category: 'Local Dishes',
    image: require('../../../assets/platain.jpg'),  },
  {
    id: '20',
    name: 'Apapransa',
    price: '$11.99',
    description: 'Apapransa with crab',
    category: 'Local Dishes',
    image: require('../../../assets/apapransa.jpg'),  },
  {
    id: '21',
    name: 'Waakye',
    price: '$14.00',
    description: 'Waakye with egg and gari',
    category: 'Local Dishes',
    image: require('../../../assets/waakye.jpg'),  },
  {
    id: '22',
    name: 'Omotuo',
    price: '$12.50',
    description: 'Omotuo with groundnut soup',
    category: 'Local Dishes',
    image: require('../../../assets/omotuo.jpg'),  },
  {
    id: '23',
    name: 'Cocoyam',
    price: '$9.50',
    description: 'Cocoyam with hot pepper',
    category: 'Local Dishes',
    image: require('../../../assets/cocoyam.jpg'),  },
  {
    id: '24',
    name: 'Angwamo',
    price: '$11.75',
    description: 'Angwamoe with pepper and fried egg',
    category: 'Local Dishes',
    image: require('../../../assets/angwamo.jpg'),  },
  {
    id: '25',
    name: 'Jollof',
    price: '$15.25',
    description: 'Jollof with fried chicken',
    category: 'Local Dishes',
    image: require('../../../assets/jollof.jpg'),  },
  {
    id: '26',
    name: '3to',
    price: '$10.99',
    description: '4to with egg',
    category: 'Local Dishes',
    image: require('../../../assets/eto.jpg'),  },
  {
    id: '27',
    name: 'Tuo zaafi',
    price: '$12.99',
    description: 'Tuo zaaf with ayoyo soup',
    category: 'Local Dishes',
    image: require('../../../assets/zaafi.jpg'),  },
  {
    id: '28',
    name: 'Kenkey',
    price: '$8.50',
    description: 'Kenkey with hot pepper and fish',
    category: 'Local Dishes',
    image: require('../../../assets/ken.jpg'),  },
    

  // Dessert
  {
    id: '31',
    name: 'Ice Cream',
    price: '$5.99',
    description: 'Tastiest Milkshake Flavors',
    category: 'Dessert',
    image: require('../../../assets/10 Tastiest Milkshake Flavors.jpg'),
  },
  {
    id: '32',
    name: 'Chocolate Cake',
    price: '$6.50',
    description: 'Rich chocolate cake with frosting',
    category: 'Dessert',
    image: require('../../../assets/cake.jpg'),  },
  {
    id: '33',
    name: 'Cheesecake',
    price: '$7.25',
    description: 'Creamy cheesecake with a graham crust',
    category: 'Dessert',
    image: require('../../../assets/Easy Cheesecake Recipe.jpg'),  },
  {
    id: '34',
    name: 'Strawberry Macaron Shells',
    price: '$8.99',
    description: 'Strawberry Macaron Shells',
    category: 'Dessert',
    image: require('../../../assets/Strawberry Macaron Shells.jpg'),  },
  {
    id: '35',
    name: 'Donuts With Chocolate',
    price: '$3.50',
    description: 'Donuts With Chocolate Topping',
    category: 'Dessert',
    image: require('../../../assets/Donuts With Chocolate Topping.jpg'),  },
  {
    id: '36',
    name: 'Buko Salad Drin',
    price: '$4.25',
    description: 'Buko Salad Drink - Foxy Folksy',
    category: 'Dessert',
    image: require('../../../assets/Buko Salad Drink - Foxy Folksy.jpg'),  },
  {
    id: '37',
    name: 'Cookies',
    price: '$9.25',
    description: 'cookies with caramelized sugar',
    category: 'Dessert',
    image: require('../../../assets/cooks.jpg'),  },
  {
    id: '38',
    name: 'Parmesan Ranch Potato Chips',
    price: '$2.99',
    description: 'Parmesan Ranch Potato Chips',
    category: 'Dessert',
    image: require('../../../assets/Parmesan Ranch Potato Chips.jpg'),  },
  {
    id: '39',
    name: 'Egg Omelettes',
    price: '$3.00',
    description: 'JUST Egg Omelettes',
    category: 'Dessert',
    image: require('../../../assets/JUST Egg Omelette.jpg'),  },
  {
    id: '40',
    name: 'Caramel Iced Coffee',
    price: '$8.00',
    description: 'Easy Homemade Caramel Iced Coffee',
    category: 'Dessert',
    image: require('../../../assets/Easy Homemade Caramel Iced Coffee.jpg'),  },
  {
    id: '41',
    name: 'French Croissants',
    price: '$6.75',
    description: 'Classic French Croissants',
    category: 'Dessert',
    image: require('../../../assets/Classic French Croissants 101 Guide.jpg'),  },
  
 
  // Beverages
{
  id: '46',
  name: 'Coca Cola',
  price: '$2.50',
  description: 'Chilled can of Coca Cola',
  category: 'Beverages',
  image: require('../../../assets/c7fdfa03-8387-4a86-a4f8-3d0f7f936ab7.jpg'),},
{
  id: '47',
  name: 'Orange Juice',
  price: '$3.99',
  description: 'Freshly squeezed orange juice',
  category: 'Beverages',
  image: require('../../../assets/Cantaloupe Agua Fresca.jpg'),},
{
  id: '48',
  name: 'Iced Coffee',
  price: '$4.50',
  description: 'Cold brew coffee with ice',
  category: 'Beverages',
  image: require('../../../assets/How To Make A Better-Than-Starbucks Chai Tea Latte.jpg'),},
{
  id: '49',
  name: 'Tastiest Milkshake',
  price: '$2.99',
  description: 'Tastiest Milkshake',
  category: 'Beverages',
  image: require('../../../assets/10 Tastiest Milkshake Flavors.jpg'),},
{
  id: '50',
  name: 'Fanta',
  price: '$3.25',
  description: 'Refreshing fanta',
  category: 'Beverages',
  image: require('../../../assets/5702b59c-4d2a-43fb-bc9c-b3cc15bd7d3e.jpg'),},
{
  id: '51',
  name: 'Mango Smoothie',
  price: '$5.50',
  description: 'Creamy mango smoothie',
  category: 'Beverages',
  image: require('../../../assets/92910a92-3766-4930-969c-a29e7245dae0.jpg'),},
{
  id: '52',
  name: 'Milkshake',
  price: '$4.99',
  description: 'Thick vanilla milkshake',
  category: 'Beverages',
  image: require('../../../assets/Buko Salad Drink - Foxy Folksy.jpg'),},
{
  id: '53',
  name: 'Cinderella Mocktail',
  price: '$3.75',
  description: 'Rich and creamy hot Cinderella Mocktail',
  category: 'Beverages',
  image: require('../../../assets/Cinderella Mocktail.jpg'),},
{
  id: '54',
  name: 'Piña Coladao',
  price: '$2.99',
  description: 'Classic Piña Coladao',
  category: 'Beverages',
  image: require('../../../assets/Classic Piña Colada.jpg'),},
{
  id: '55',
  name: 'Como fazer Milk Shake',
  price: '$4.25',
  description: 'Como fazer Milk Shake - Fácil',
  category: 'Beverages',
  image: require('../../../assets/Como fazer Milk Shake - Fácil.jpg'),},
{
  id: '56',
  name: 'ropical Avocado Smoothie',
  price: '$1.00',
  description: 'ropical Avocado Smoothie',
  category: 'Beverages',
  image: require('../../../assets/Double-Decker Tropical Avocado Smoothies - Cooking Classy (1).jpg'),},
{
  id: '57',
  name: 'Ginger Ale',
  price: '$2.75',
  description: 'Grapefruit Ginger Fizz Mocktaile',
  category: 'Beverages',
  image: require('../../../assets/Grapefruit Ginger Fizz Mocktail.jpg'),},
{
  id: '58',
  name: 'Lemonade',
  price: '$4.50',
  description: 'Old Fashioned Lemonade',
  category: 'Beverages',
  image: require('../../../assets/Old Fashioned Lemonade.jpg'),},

];


const categories = ['All', 'Fast Food', 'Local Dishes', 'Dessert', 'Beverages'];


const ShopScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { addToFavorites } = useFavorites();

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
        <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(item)}>
            <Icon name="heart" type="feather" color="red" size={30} />
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
  addToCartButton: {
    backgroundColor: '#3C4748',
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
  addToCartText: {
    color: 'white',
    fontSize: 13,
  },
  favoriteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default ShopScreen;
