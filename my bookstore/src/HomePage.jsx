import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1>Bem-vindo à My bookStore</h1>
        <p>Este é um sistema de gerenciamento de livros e usuários. Com ele, você pode:</p>
        <ul>
          <li>Adicionar novos livros à sua biblioteca.</li>
          <li>Visualizar e editar informações dos livros.</li>
          <li>Gerenciar usuários e atribuir livros a eles.</li>
        </ul>
        <p>Explore as opções abaixo para começar a gerenciar seus livros e usuários.</p>
        <div className="button-container">
          <Link to="/usuarios">
            <button className="btn">Usuários</button>
          </Link>
          <Link to="/livros">
            <button className="btn">Livros</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
