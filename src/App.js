import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Notfound from './Components/Notfound';
import Signup from './Components/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}
