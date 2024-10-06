import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import commomStyles from '../commomStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function App({ onAddTask, filter}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [estimateAt, setEstimateAt] = useState(new Date()); // Inicializa como um objeto Date


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



  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
        mode: 'datetime',
        value: estimateAt,
        onChange: (event, date) => {
            if (event.type === 'set' && date) {
                setEstimateAt(new Date(date)); // Sempre crie um novo objeto Date
            }
        },
        positiveButton: { label: 'OK', textColor: 'green' },
        negativeButton: { label: 'Cancel', textColor: 'red' },
    });
};

  

const handleSave = () => {
  // Confirma se estimateAt é um objeto Date
  if (taskDescription.trim() && estimateAt instanceof Date) {
      const newTask = {
          desc: taskDescription,
          estimateAt: estimateAt.toISOString(), // Converte para ISO
          doneAt: null,
      };
      console.log('Nova Tarefa:', newTask); // Verifique se a nova tarefa está correta
      onAddTask(newTask); // Passa a tarefa para a função de adicionar
      
      setTaskDescription(''); // Limpa a descrição
      setEstimateAt(new Date()); // Reseta a data
      hideModal(); // Fecha o modal
  } else {
      Alert.alert('Erro', 'Descrição é um campo obrigatório.');
  }
};



  
  

  return (
    <View style={styles.container}>
      <View style={styles.add}>
        <TouchableOpacity onPress={showModal}>
          <Ionicons name="add-circle-outline" size={40} color={iconColor} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, {backgroundColor: iconColor} ]}>Nova Tarefa</Text>
            <TextInput
            style={styles.modalMessage}
            placeholder='Informe a descrição'
            placeholderTextColor='gray'
            onChangeText={text => setTaskDescription(text)} // Atualiza a descrição
            value={taskDescription} // Mostra o valor atual
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePicker}
            >
              <Text style={styles.dateButtonText}>
                {estimateAt ? `Data Estimada: ${moment(estimateAt).format('DD/MM/YYYY')}` : 'Selecione a Data e Hora'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: iconColor} ]}
                onPress={hideModal}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: iconColor} ]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: commomStyles.latoBold,
    backgroundColor: commomStyles.colors.today,
    width: '100%',
    textAlign: 'center',
    color: '#FFF',
    height: 40,
    lineHeight: 40,
  },
  modalMessage: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    width: '100%',
  },
  dateButton: {
    height: 40,
    
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    width: '100%',
    marginBottom: 15,
  },
  dateButtonText: {
    color: 'gray',
    fontSize: 14,
    fontFamily: commomStyles.latoRegular
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  add: {
    position: 'absolute',
    left: '85%',
  },
});
