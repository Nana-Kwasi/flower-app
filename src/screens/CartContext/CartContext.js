// src/contexts/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { generateUniqueId } from '../Utils/generateUniqueId';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.name === product.name);
      if (existingProduct) {
        const updatedCart = prevItems.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
        console.log('Updated Cart after adding existing product:', updatedCart);
        return updatedCart;
      }
      const newCart = [...prevItems, { ...product, price: parseFloat(product.price.replace('$', '')), quantity: 1, cartItemId: generateUniqueId() }];
      console.log('Updated Cart after adding new product:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== product.name));
    console.log('Updated Cart after removing product:', cartItems);
  };

  const increaseQuantity = (product) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    console.log('Updated Cart after increasing quantity:', cartItems);
  };

  const decreaseQuantity = (product) => {
    setCartItems((prevItems) => {
      const productToUpdate = prevItems.find((item) => item.name === product.name);
      if (productToUpdate.quantity > 1) {
        const updatedItems = prevItems.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity - 1 } : item
        );
        console.log('Updated Cart after decreasing quantity:', updatedItems);
        return updatedItems;
      } else {
        Alert.alert(
          "Remove Product",
          "Do you want to remove this product from the cart?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => removeFromCart(product)
            }
          ],
          { cancelable: true }
        );
        return prevItems;
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, clearCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);




// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (item) => {
//     setCartItems((prevItems) => [...prevItems, item]);
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const increaseQuantity = (item) => {
//     setCartItems((prevItems) =>
//       prevItems.map((cartItem) =>
//         cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
//       )
//     );
//   };

//   const decreaseQuantity = (item) => {
//     setCartItems((prevItems) =>
//       prevItems.map((cartItem) =>
//         cartItem.id === item.id && cartItem.quantity > 1
//           ? { ...cartItem, quantity: cartItem.quantity - 1 }
//           : cartItem
//       )
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, setCartItems, addToCart, clearCart, increaseQuantity, decreaseQuantity }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);