import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@gstock_products');
      if (jsonValue != null) {
        setProducts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newProducts) => {
    try {
      const jsonValue = JSON.stringify(newProducts);
      await AsyncStorage.setItem('@gstock_products', jsonValue);
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  const addProduct = async (product) => {
    // product: { id, name, buyPrice, quantity, imageHost/Uri, barcodes: [] }
    // Check if barcode exists?
    const newProducts = [...products, { ...product, id: Date.now().toString() }];
    setProducts(newProducts);
    await saveData(newProducts);
  };

  const deleteProduct = async (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    await saveData(newProducts);
  };

  const updateProduct = async (id, updatedFields) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setProducts(newProducts);
    await saveData(newProducts);
  };

  const sellProduct = async (id, quantityToSell = 1) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (product.quantity < quantityToSell) {
       Alert.alert("Error", "Not enough stock!");
       return;
    }

    const newProducts = products.map(p => 
      p.id === id ? { ...p, quantity: p.quantity - quantityToSell } : p
    );
    setProducts(newProducts);
    await saveData(newProducts);
  };

  return (
    <StockContext.Provider value={{
      products,
      addProduct,
      deleteProduct,
      updateProduct,
      sellProduct,
      loading
    }}>
      {children}
    </StockContext.Provider>
  );
};
