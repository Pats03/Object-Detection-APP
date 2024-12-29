import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Attendance from './pages/Attendance';
import Doubleattendance from './pages/Doubleattendance';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/singlepic" element={<Attendance />} />
          <Route path="/doublepic" element={<Doubleattendance />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
