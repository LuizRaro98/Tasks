import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import login from '../../assets/imgs/login.jpg';
import { StatusBar } from 'expo-status-bar';
import commomStyles from '../commomStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenamento local

const LoginScreen = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const navigation = useNavigation();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateName = (name) => name.trim().length > 0;

  useEffect(() => {
    setIsButtonDisabled(!validateEmail(email) || !validatePassword(password) || (isRegistering && (!validateName(name) || confirmPassword.length === 0)));
  }, [email, password, confirmPassword, name, isRegistering]);

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://192.168.0.222:3000/signin', { email, password });
        await AsyncStorage.setItem('token', response.data.token); // Armazenar token
        setIsAuthenticated(true); // Atualiza o estado de autenticação
    } catch (error) {
        let errorMessage = error.response?.data?.error || 'Erro desconhecido. Tente novamente.';
        Alert.alert('Erro', errorMessage);
    }
};



const handleRegister = async () => {
  if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
  }
  
  if (!validateName(name)) {
      setNameError('Nome é obrigatório');
      return;
  }

  try {
      await axios.post('http://192.168.0.222:3000/signup', { name, email, password });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      setIsRegistering(false);
      // Limpa os campos após o cadastro
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
  } catch (error) {
      let errorMessage = error.response?.data?.error || 'Erro desconhecido. Tente novamente.';
      Alert.alert('Erro', errorMessage);
  }
};


  const handleEmailBlur = () => {
    setEmailError(validateEmail(email) ? '' : 'E-mail inválido');
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password) ? '' : 'A senha deve ter pelo menos 6 caracteres');
  };

  const handleNameBlur = () => {
    setNameError(validateName(name) ? '' : 'Nome é obrigatório');
  };

  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setConfirmPasswordError('');
  }, [isRegistering]);
  

  return (
    <ImageBackground source={login} style={styles.container}>
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <Text style={styles.title}>Tasks</Text>

        {isRegistering && (
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#fff" />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#fff"
              value={name}
              onChangeText={setName}
              onBlur={handleNameBlur}
            />
          </View>
        )}
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#fff" />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#fff" />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            onBlur={handlePasswordBlur}
            secureTextEntry
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {isRegistering && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              placeholderTextColor="#fff"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={isRegistering ? handleRegister : handleLogin}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>{isRegistering ? 'Cadastrar' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.linkText}>
            {isRegistering ? 'Já possui uma conta? Entrar' : 'Ainda não possui uma conta? Cadastre-se'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontFamily: commomStyles.latoBold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: commomStyles.latoBold,
  },
  linkText: {
    color: '#fff',
    marginTop: 15,
    fontFamily: commomStyles.latoBold,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontFamily: commomStyles.latoBold,
    padding: 0,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default LoginScreen;
