import React, { useCallback } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import commomStyles from '../commomStyles';


const CustomDrawerContent = ({ setIsAuthenticated, username, filter, ...props }) => {

  
  const handleLogout = useCallback(async () => {
    try {
        await AsyncStorage.removeItem('token'); // Remove o token do AsyncStorage
        setIsAuthenticated(false); // Atualiza o estado de autenticação
    } catch (error) {
        console.error('Erro ao remover o token:', error);
    }
}, [setIsAuthenticated]);

let iconColor;
switch (filter) {
    case 'Hoje':
        iconColor = commomStyles.colors.today; // Cor para "Hoje"
        break;
    case 'Amanhã':
        iconColor = commomStyles.colors.tomorrow; // Cor para "Amanhã"
        break;
    case 'Semana':
        iconColor = commomStyles.colors.week; // Cor para "Semana"
        break;
    case 'Mês':
        iconColor = commomStyles.colors.month; // Cor para "Mês"
        break;
    default:
        iconColor = commomStyles.colors.default; // Cor padrão
}


  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      {/* Header com ícone e nome do usuário */}
      <View style={[styles.header, {backgroundColor: iconColor}]}>
        <Ionicons name="person-circle-outline" size={50} color="white" />
        <Text style={styles.username}>{username}</Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        accessibilityLabel="Sair"
        accessibilityRole="button"
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  username: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e63946',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
