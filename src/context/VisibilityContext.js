import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
  const STORAGE_KEY_IS_SHOWN = '@is_shown';
  const [isShown, setIsShown] = useState(true);

  const loadIsShown = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_IS_SHOWN);
      if (jsonValue != null) {
        setIsShown(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Erro ao carregar estado de visibilidade', e);
    }
  };

  const saveIsShown = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY_IS_SHOWN, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar estado de visibilidade', e);
    }
  };

  useEffect(() => {
    loadIsShown();
  }, []);

  useEffect(() => {
    saveIsShown(isShown);
  }, [isShown]);

  return (
    <VisibilityContext.Provider value={{ isShown, setIsShown }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => {
  return useContext(VisibilityContext);
};
