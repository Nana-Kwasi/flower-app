import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useProfile } from '../ProfileContext/ProfileContext'; // Import the useProfile hook
import { format } from 'date-fns';
import { MaterialIcons, Entypo } from '@expo/vector-icons'; // Import icons from Expo

// Importing images
const images = {
  'Tulips Bouquet': require('../../../assets/pexels-pixabay-53141.jpg'),
  'Peony Bouquet': require('../../../assets/pexels-lynda-sanchez-825238-2300713.jpg'),
  'Rose': require('../../../assets/pexels-pixabay-236259.jpg'),
  'Daisy': require('../../../assets/pexels-valeriiamiller-3392982.jpg'),
};

const ProfileScreen = () => {
  const { profile, getCustomerName } = useProfile();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const customerName = getCustomerName();
  const { orderHistory, location } = profile;

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.profileContainer}>
          <MaterialIcons name="person" size={100} color="#000" />
          <Text style={styles.profileName}>{customerName}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Entypo name="location-pin" size={24} color="black" />
          <Text style={styles.locationText}>
            {location ? `${location.city}, ${location.country}` : 'Location: N/A'}
          </Text>
        </View>
        <View style={styles.customerDataCard}>
          <Text style={styles.customerDataText}>Email: {profile.customerData?.email || 'N/A'}</Text>
          <Text style={styles.customerDataText}>Phone: {profile.customerData?.phoneNumber || 'N/A'}</Text>
        </View>
        <Text style={styles.headerText}>Order History:</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {orderHistory.length > 0 ? (
          orderHistory.map((order, index) => (
            <View key={index} style={styles.checkoutItem}>
              <Text style={styles.dateText}>
                {format(new Date(order.checkoutTime), 'MMMM do, yyyy - h:mm a')}
              </Text>
              <View style={styles.itemContainer}>
                {order.cartItems && order.cartItems.length > 0 ? (
                  order.cartItems.map((item, idx) => (
                    <View key={idx} style={styles.item}>
                      <Image source={images[item.name]} style={styles.image} />
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                      <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>No items found for this order.</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No order history found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fixedHeader: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 8,
  },
  checkoutItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  item: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 325,
    height: 200,
    marginBottom: 5,
    alignSelf: "flex-start"
  },
  itemText: {
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 90,
    color: "#3C4748"
  },
  customerDataCard: {
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  customerDataText: {
    fontSize: 16,
    color: '#00796b',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#00796b',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default ProfileScreen;
