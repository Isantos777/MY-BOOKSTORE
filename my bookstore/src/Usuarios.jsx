import React, { useState, useEffect } from "react";
import api from "./api";
import { Link } from "react-router-dom";
import "./App.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  const [action, setAction] = useState("incluir");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar os usuários:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome) {
      alert("O campo Nome é obrigatório.");
      return;
    }
    try {
      const usuarioData = { nome };
      if (usuarioId) {
        await api.put(`/usuarios/${usuarioId}`, usuarioData);
        alert("Usuário atualizado com sucesso!");
      } else {
        await api.post("/usuarios", usuarioData);
        alert("Usuário cadastrado com sucesso!");
      }
      resetForm();
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        alert("Usuário excluído com sucesso!");
        carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário");
      }
    }
  };

  const resetForm = () => {
    setNome("");
    setUsuarioId(null);
    setAction("incluir");
  };

  return (
    <div className="usuarios-container">
      <h1>Gerenciar Usuários</h1>

      <form onSubmit={handleSave}>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <button type="submit">{usuarioId ? "Atualizar" : "Cadastrar"} Usuário</button>
        {usuarioId && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <h2>Usuários Cadastrados</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>
                <button onClick={() => { setUsuarioId(usuario.id); setNome(usuario.nome); }}>Editar</button>
                <button onClick={() => handleDelete(usuario.id)} className="delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="navigation-links">
        <Link to="/livros">Ir para Livros</Link>
      </div>
      <div className="back-to-home">
        <Link to="/">Voltar para a Página Inicial</Link>
      </div>
    </div>
  );
}

export default Usuarios;
