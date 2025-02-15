// WelcomeScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const images = [
  require('../../../assets/daniela-e-QA8nKvl_bso-unsplash.jpg'),
  require('../../../assets/manel-sean-v9OOmheGCkc-unsplash.jpg'),
  require('../../../assets/pexels-8moments-1353126.jpg'),
  require('../../../assets/pexels-bestasya-11960776.jpg'),
  require('../../../assets/pexels-valeriya-74512.jpg'),
  require('../../../assets/pexels-shvetsa-3746197.jpg'),
  require('../../../assets/pexels-secret-garden-333350-931176.jpg'),
  require('../../../assets/pexels-shkrabaanthony-4612235.jpg'),
 require('../../../assets/pexels-marta-dzedyshko-1042863-2377470.jpg'),
 require('../../../assets/pexels-iriser-1420016.jpg'),
 require('../../../assets/pexels-jennifer-murray-402778-1067202.jpg'),



  // Add more images as needed
];

const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
    
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth}
        height={screenHeight}
        autoPlay
        data={images}
        scrollAnimationDuration={2000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
      />
        <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Model Flowers!</Text>
        <Text style={styles.welcomeText2}>All Right Reserved 2024</Text>
      </View>
      <TouchableOpacity 
        style={styles.arrowContainer} 
        onPress={() => navigation.navigate('Main')}
      >
        <Icon name="arrow-forward" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  carouselItem: {
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
  welcomeText: {
    fontSize: 30,
    color: 'yellow',
    fontWeight: 'bold',
    marginBottom:290,
    marginHorizontal:50
  },
  welcomeText2: {
    fontSize: 13,
    color: 'white',
    // fontWeight: 'bold',
   marginHorizontal:90,
   marginBottom:20
  },

  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
});

export default WelcomeScreen;
