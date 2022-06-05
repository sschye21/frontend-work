import React from 'react';
import QuizDisplay from '../components/QuizDisplay'
import Home from '../components/Home'

const Dashboard = () => {
  // get the games
  return (
    <>
      <Home />
      <h1>Welcome to the Dashboard</h1>
      <QuizDisplay />
    </>
  );
}

export default Dashboard
