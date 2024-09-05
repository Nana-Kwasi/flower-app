import React, { createContext, useContext, useState } from 'react';

const FavoriteContext = createContext();

export const useFavorites = () => {
  return useContext(FavoriteContext);
};

export const FavoriteProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  const addToFavorites = (item) => {
    setFavoriteItems((prevItems) => [...prevItems, item]);
  };

  const removeFromFavorites = (item) => {
    setFavoriteItems((prevItems) => prevItems.filter((favItem) => favItem.id !== item.id));
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItems, addToFavorites, removeFromFavorites, setFavoriteItems }}>
      {children}
    </FavoriteContext.Provider>
  );
};
