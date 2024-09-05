import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    customerData: null,
    orderHistory: [],
    location: '', // Add location to the profile state
  });

  // Load profile from AsyncStorage
  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('@profile');
      if (savedProfile !== null) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile data:', error.message);
    }
  };

  // Save profile to AsyncStorage
  const saveProfile = async (profile) => {
    try {
      await AsyncStorage.setItem('@profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile data:', error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const addOrderToHistory = (order) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      orderHistory: [...prevProfile.orderHistory, order],
      customerData: order.customerData, // Ensure customerData is updated
      location: order.location, // Update location
    }));
  };

  const getCustomerName = () => {
    if (profile.customerData) {
      return profile.customerData.name || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, addOrderToHistory, getCustomerName }}>
      {children}
    </ProfileContext.Provider>
  );
};
