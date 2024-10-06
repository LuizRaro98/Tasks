import React, { useState,  useMemo } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'moment/locale/pt-br';
import commomStyles from '../commomStyles';
import Task from '../components/Task';
import ScreenModal from './Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useVisibility } from '../context/VisibilityContext';

moment.locale('pt-br');
let date;

const API_URL = 'http://192.168.0.222:3000/tasks';

export default function TaskList({ filter, ImageBackgrounds }) {
  const { isShown, setIsShown } = useVisibility();
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskList(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Move para o finally para garantir que sempre será chamado
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const handlePress = () => {
    setIsShown((prev) => !prev);
  };

  const handleToggle = async (taskId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    try {
      const task = taskList.find((t) => t.id === taskId);
      const newDoneAt = task.doneAt ? null : new Date().toISOString();

      const response = await axios.put(`${API_URL}/${taskId}/toggle`, { doneAt: newDoneAt }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTask = response.data;
      setTaskList((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error.response?.data || error.message);
    }
  };

  const addTask = async (newTask) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!newTask.desc || !newTask.estimateAt) {
        console.error('Descrição ou data estimada são obrigatórias');
        return;
      }

      const response = await axios.post(API_URL, {
        desc: newTask.desc,
        estimateAt: newTask.estimateAt,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error.response?.data || error.message);
    }
  };

  const filteredTasks = useMemo(() => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    const tomorrowStart = moment().add(1, 'day').startOf('day');
    const tomorrowEnd = moment().add(1, 'day').endOf('day');
    const weekStart = moment().startOf('week');
    const weekEnd = moment().endOf('week');
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');

    switch (filter) {
      case 'Hoje':
        date = moment().format('dddd, D [de] MMMM'); // Data de hoje
        return taskList.filter(task => moment(task.estimateAt).isBetween(todayStart, todayEnd, null, '[]'))

      case 'Amanhã':
        date = moment().add(1, 'day').format('dddd, D [de] MMMM'); // Data de amanhã
        return taskList.filter(task => moment(task.estimateAt).isBetween(tomorrowStart, tomorrowEnd, null, '[]'));

      case 'Semana':
        date = moment().startOf('week').format('D [de] MMMM') + ' até ' + moment().endOf('week').format('D [de] MMMM'); // Intervalo da semana

        return taskList.filter(task => moment(task.estimateAt).isBetween(weekStart, weekEnd, null, '[]'));
      case 'Mês':
        date = moment().startOf('month').format('[Mês de] MMMM') 

        return taskList.filter(task => moment(task.estimateAt).isBetween(monthStart, monthEnd, null, '[]'));
      default:
        return taskList;
    }
  }, [taskList, filter]);

  const deleteTask = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadTasks();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const editTask = async (id, updatedData) => {
    const token = await AsyncStorage.getItem('token');
    try {
        await axios.put(`${API_URL}/${id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        loadTasks();
    } catch (error) {
        console.error('Erro ao editar tarefa:', error);
    }
};

  

  if (isLoading) {
    return <View style={styles.loadingContainer}><Text>Carregando...</Text></View>;
  }

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={ImageBackgrounds} style={styles.image}>
        <View style={styles.headerActions}>
          <View style={styles.openDrawer}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.eyes}>
            <TouchableOpacity onPress={handlePress}>
              {isShown ? (
                <Ionicons name="eye-outline" size={25} color="white" />
              ) : (
                <Ionicons name="eye-off-outline" size={25} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.barTitle}>
          <Text style={styles.title}>{filter}</Text>
          <Text style={styles.subtitle}>{date}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={filteredTasks}
          renderItem={({ item }) => (
            (isShown || item.doneAt === null) ? (
              <Task
                id={item.id}
                desc={item.desc}
                estimateAt={item.estimateAt}
                doneAt={item.doneAt}
                onToggle={handleToggle}
                onDelete={deleteTask}
                onEdit={editTask} // Passando a função editTask
                filter={filter}
              />
            ) : null
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <ScreenModal onAddTask={addTask} filter={filter} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    flex: 3,
    width: '100%',
    
  },
  taskList: {
    flex: 7,
    marginLeft: 10,
  },
  title: {
    fontFamily: commomStyles.latoBold,
    color: commomStyles.colors.secondary,
    fontSize: 50,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commomStyles.latoRegular,
    color: commomStyles.colors.secondary,
    fontSize: 20,
    marginBottom: 20,
  },
  barTitle: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 30,
  },
  headerActions: {
    flexDirection: 'row', // Coloca os itens na horizontal
    justifyContent: 'space-between', // Espaça os itens igualmente
    alignItems: 'center',  // Centraliza os ícones verticalmente
    paddingHorizontal: 25, // Adiciona espaço lateral
    
  },
  eyes: {
    marginTop: '8%', // Ajusta conforme necessário
    marginLeft: 'auto', // Empurra para o final da linha (caso não use justifyContent)
  },
  openDrawer: {
    marginTop: '8%', // Ajusta conforme necessário
  },
});
