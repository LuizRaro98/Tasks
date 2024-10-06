import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import LoginScreen from './screens/Auth';
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import TodayTasks from './components/TodayTasks';
import TomorrowTasks from './components/TomorrowTasks';
import WeekTasks from './components/WeekTasks';
import MonthTasks from './components/MonthTasks';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from './components/CustomDrawerContent';
import { jwtDecode } from "jwt-decode";
import { VisibilityProvider } from './context/VisibilityContext'; // Importando o VisibilityProvider
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Lato_700Bold,
    Lato_400Regular,
  });

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: React has detected a change in the order of Hooks called by TaskList.']);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [filter, setFilter] = useState('Hoje'); // Estado para o filter

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.name || 'Usuário');
          setIsAuthenticated(true); // Define como autenticado
        }
      } catch (error) {
        console.error('Erro ao obter o token:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento se preferir
  }

  return (
    <VisibilityProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationContainer>
          {isAuthenticated ? (
            <Drawer.Navigator 
              initialRouteName="Hoje" 
              drawerContent={(props) => (
                <CustomDrawerContent
                  {...props} 
                  setIsAuthenticated={setIsAuthenticated}
                  username={username} 
                  filter={filter} // Passa o valor atualizado de filter
                />
              )}
              screenOptions={{
                headerShown: false,
                drawerStyle: {
                  backgroundColor: '#fff',
                  width: 240,
                },
                sceneContainerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            >
              <Drawer.Screen 
                name="Hoje" 
                component={TodayTasks} 
                options={{
                  drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
                }}
                listeners={{
                  focus: () => setFilter('Hoje'), // Atualiza o filter quando a tela é focada
                }}
              />
              <Drawer.Screen 
                name="Amanhã" 
                component={TomorrowTasks} 
                options={{
                  drawerIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />
                }}
                listeners={{
                  focus: () => setFilter('Amanhã'),
                }}
              />
              <Drawer.Screen 
                name="Semana" 
                component={WeekTasks} 
                options={{
                  drawerIcon: ({ color }) => <Ionicons name="calendar-number" size={24} color={color} />
                }}
                listeners={{
                  focus: () => setFilter('Semana'),
                }}
              />
              <Drawer.Screen 
                name="Mês" 
                component={MonthTasks} 
                options={{
                  drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />
                }}
                listeners={{
                  focus: () => setFilter('Mês'),
                }}
              />
            </Drawer.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth">
                {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
              </Stack.Screen>
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </GestureHandlerRootView>
    </VisibilityProvider>
  );
}
