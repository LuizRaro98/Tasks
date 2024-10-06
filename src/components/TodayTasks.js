// src/screens/TodayTasks.js
import React from 'react';
import TaskList from '../screens/TaskList';
import today from '../../assets/imgs/today.jpg';


const TodayTasks = () => <TaskList filter="Hoje" ImageBackgrounds={today}/>;
export default TodayTasks;
