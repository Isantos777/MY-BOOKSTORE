import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Usuarios from './Usuarios'; // Importando o componente de Usuários
import Livros from './Livros'; // Importando o componente de Livros
import HomePage from './HomePage'; // Importando a página inicial
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container"><div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Página inicial */}
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/livros" element={<Livros />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
