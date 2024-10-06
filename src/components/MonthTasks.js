// src/screens/MonthTasks.js
import React from 'react';
import TaskList from '../screens/TaskList';
import month from '../../assets/imgs/month.jpg'



const MonthTasks = () => <TaskList filter="Mês" ImageBackgrounds={month} />;
export default MonthTasks;
