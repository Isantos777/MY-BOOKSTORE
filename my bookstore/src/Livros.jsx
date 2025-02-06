import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [statusLeitura, setStatusLeitura] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [livroId, setLivroId] = useState(null);
  const [outroGenero, setOutroGenero] = useState(false);

  useEffect(() => {
    carregarLivros();
    carregarUsuarios();
  }, []);

  const carregarLivros = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/livros");
      setLivros(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error.response ? error.response.data : error.message);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/usuarios");
      setUsuarios(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.response ? error.response.data : error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const generoFinal = outroGenero ? genero : genero;

    if (!usuarioId || !titulo || !autor || !generoFinal || !statusLeitura) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const livroData = {
        titulo,
        autor,
        genero: generoFinal,
        status_leitura: statusLeitura,
        usuarioId,
      };

      if (livroId) {
        await axios.put(`http://localhost:3000/livros/${livroId}`, livroData);
        alert("Livro atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3000/livros", livroData);
        alert("Livro cadastrado com sucesso!");
      }

      resetForm();
      carregarLivros();
    } catch (error) {
      console.error("Erro ao salvar livro:", error.response ? error.response.data : error.message);
      alert("Erro ao salvar livro: " + (error.response ? error.response.data : error.message));
    }
  };

  const resetForm = () => {
    setTitulo("");
    setAutor("");
    setGenero("");
    setOutroGenero(false);
    setStatusLeitura("");
    setUsuarioId("");
    setLivroId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/livros/${id}`);
      alert("Livro excluído com sucesso!");
      carregarLivros();
    } catch (error) {
      console.error("Erro ao excluir livro:", error.response ? error.response.data : error.message);
      alert("Erro ao excluir livro");
    }
  };

  const handleEdit = (livro) => {
    setLivroId(livro.id);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setGenero(livro.genero);
    setStatusLeitura(livro.status_leitura);
    setUsuarioId(livro.usuarioId);

    if (!generosPredefinidos.includes(livro.genero)) {
      setOutroGenero(true);
    }
  };

  const generosPredefinidos = [
    "Ficção", "Mistério", "Romance", "Aventura", "Histórico", "Ciência", "Fantasia", "Terror"
  ];

  return (
    <div className="livros-container"> {/* Usando a tela inteira */}
      <h1>Gerenciar Livros</h1>

      {/* Formulário de Cadastro de Livro */}
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <select
          value={outroGenero ? "outro" : genero}
          onChange={(e) => {
            if (e.target.value === "outro") {
              setOutroGenero(true);
              setGenero("");
            } else {
              setOutroGenero(false);
              setGenero(e.target.value);
            }
          }}
          required
        >
          <option value="">Selecione o Gênero</option>
          {generosPredefinidos.map((gen) => (
            <option key={gen} value={gen}>
              {gen}
            </option>
          ))}
          <option value="outro">Outro...</option>
        </select>

        {outroGenero && (
          <input
            type="text"
            placeholder="Digite o gênero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          />
        )}

        <select
          value={statusLeitura}
          onChange={(e) => setStatusLeitura(e.target.value)}
          required
        >
          <option value="">Selecione o Status</option>
          <option value="Não iniciado">Não iniciado</option>
          <option value="Desejo ler">Desejo ler</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Abandonado">Abandonado</option>
          <option value="Finalizado">Finalizado</option>
        </select>

        <select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          required
        >
          <option value="">Selecione o Usuário</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </option>
          ))}
        </select>

        <button type="submit">{livroId ? "Atualizar" : "Salvar"}</button>
        {livroId && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>
      
      <h2>Lista de Livros</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>Status</th>
            <th>Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.genero}</td>
              <td>{livro.status_leitura}</td>
              <td>{livro.usuario ? livro.usuario.nome : "Desconhecido"}</td>
              <td>
                <button onClick={() => handleEdit(livro)}>Editar</button>
                <button onClick={() => handleDelete(livro.id)} style={{ marginLeft: "10px", color: "red" }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Links de navegação */}
      <div className="navigation-links">
        <Link to="/usuarios">Ir para Usuários</Link>
      </div>
      <div className="back-to-home">
        <Link to="/">Voltar para a Página Inicial</Link>
      </div>
    </div>
  );
};

export default Livros;
