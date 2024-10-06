import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Modal, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import commomStyles from '../commomStyles';
import moment from 'moment';
import 'moment/locale/pt-br';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function Task(props) {
  const [isDone, setIsDone] = useState(props.doneAt !== null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editDesc, setEditDesc] = useState(props.desc);
  const [estimateAt, setEstimateAt] = useState(props.estimateAt ? new Date(props.estimateAt) : new Date()); // Data original
  const [tempEstimateAt, setTempEstimateAt] = useState(estimateAt); // Estado temporário para a data


  let iconColor;
  switch (props.filter) {
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




  const handlePress = () => {
    const newIsDone = !isDone;
    setIsDone(newIsDone);
    if (props.onToggle) {
      props.onToggle(props.id, newIsDone);
    }
  };


  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
  };

  const handleEdit = () => {
    setTempEstimateAt(estimateAt); // Define o estado temporário ao abrir o modal
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editDesc.trim() && tempEstimateAt instanceof Date) {
      const updatedData = {
        desc: editDesc,
        estimateAt: tempEstimateAt.toISOString(), // Converte para ISO o estado temporário
      };
  
      if (props.onEdit) {
        props.onEdit(props.id, updatedData);
      }
      setEstimateAt(tempEstimateAt); // Atualiza a data original ao confirmar
      setModalVisible(false);
    } else {
      console.warn('Descrição ou data estimada inválidas.');
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      mode: 'datetime',
      value: tempEstimateAt, // Usa o estado temporário para a data
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          const selectedDate = new Date(date); // Converte para objeto Date
          if (!isNaN(selectedDate)) { // Verifica se a data é válida
            setTempEstimateAt(selectedDate); // Atualiza apenas o estado temporário
          }
        }
      },
      positiveButton: { label: 'OK', textColor: 'green' },
      negativeButton: { label: 'Cancelar', textColor: 'red' },
    });
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0, 1],
      outputRange: [1, 0, 0, -20],
    });
    return (
      <>
        <RectButton style={styles.rightActionEdit} onPress={handleEdit}>
          <Animated.Text style={[styles.actionText, { transform: [{ translateX: trans }] }]}>
            <Ionicons name="create-outline" size={30} color="white" />
          </Animated.Text>
        </RectButton>
        <RectButton style={styles.rightActionDelete} onPress={handleDelete}>
          <Animated.Text style={[styles.actionText, { transform: [{ translateX: trans }] }]}>
            <Ionicons name="trash" size={30} color="white" />
          </Animated.Text>
        </RectButton>
      </>
    );
  };

  const textStyle = {
    textDecorationLine: isDone ? 'line-through' : 'none',
  };

  const date = isDone && props.doneAt ? props.doneAt : estimateAt; 

  const formattedDate = moment(date).isValid()
    ? moment(date).locale('pt-br').format('dddd, D [de] MMMM')
    : 'Data inválida';

  return (
    <>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.container}>
          <View style={styles.checkContainer}>
            <TouchableOpacity onPress={handlePress}>
              {pending(isDone)}
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.desc, textStyle]}>{props.desc}</Text>
            <Text style={styles.subText}>{formattedDate}</Text>
          </View>
          <View style={styles.indicatorContainer}>
            <Ionicons name="arrow-back-outline" size={20} color="#AAA" />
          </View>
        </View>
      </Swipeable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { backgroundColor: iconColor }]}>Editar Tarefa</Text>
            <TextInput
              style={styles.modalMessage}
              placeholder='Informe a descrição'
              placeholderTextColor='gray'
              onChangeText={setEditDesc}
              value={editDesc}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePicker}
            >
              <Text style={styles.dateButtonText}>
                {tempEstimateAt ? `Data Estimada: ${moment(tempEstimateAt).format('DD/MM/YYYY')}` : 'Selecione a Data e Hora'}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: iconColor}]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: iconColor }]}
                onPress={saveEdit}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const pending = (isDone) => {
  return (
    <View style={isDone ? styles.doneAt : styles.notDoneAt}>
      {isDone && <Ionicons name="checkmark" size={30} color="white" />}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkContainer: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneAt: {
    width: 30,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  notDoneAt: {
    width: 30,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  desc: {
    fontFamily: commomStyles.latoRegular,
    color: commomStyles.colors.main,
    fontSize: 15,
  },
  subText: {
    fontFamily: commomStyles.latoRegular,
    color: commomStyles.colors.subText,
    fontSize: 12,
  },
  rightActionDelete: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  rightActionEdit: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  indicatorContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
});
