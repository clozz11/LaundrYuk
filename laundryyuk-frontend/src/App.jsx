// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';   
import Login from './login'; 
import CustomerDashboard from './CustomerDashboard';
import Pemesanan from './Pemesanan';
import DalamProses from './DalamProses';
import AdminDashboard from './AdminDashboard';
import RiwayatPesanan from './RiwayatPesanan';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          
          <Route path="/" element={<Home />} /> 
          
          <Route path="/login" element={<Login />} />

          <Route path="/customer" element={<CustomerDashboard />} />

          <Route path="/pemesanan" element={<Pemesanan />} />
          
          <Route path="/dalamproses" element={<DalamProses />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/riwayat" element={<RiwayatPesanan />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;