// src/screens/WeekTasks.js
import React from 'react';
import TaskList from '../screens/TaskList';
import week from '../../assets/imgs/week.jpg'


const WeekTasks = () => <TaskList filter="Semana" ImageBackgrounds={week}/>;
export default WeekTasks;
