import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import QuizResult from './pages/QuizResult'
import Edit from './pages/Edit'
import PlayerJoin from './pages/PlayerJoin'
import PlayerSession from './pages/PlayerSession'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:quizid" element={<QuizResult />} />
          <Route path="/edit/:quizid" element={<Edit />} />
          <Route path="/playerjoin" element={<PlayerJoin />} />
          <Route path="/playerjoin/:playerId/:sessionid" element={<PlayerSession />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
