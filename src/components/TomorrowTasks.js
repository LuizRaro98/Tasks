// src/screens/TomorrowTasks.js
import React from 'react';
import TaskList from '../screens/TaskList';
import tomorrow from '../../assets/imgs/tomorrow.jpg'


const TomorrowTasks = () => <TaskList filter="Amanhã" ImageBackgrounds={tomorrow} />;
export default TomorrowTasks;
