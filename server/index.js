const express = require("express");
const cors = require("cors");  // Importa o cors
const app = express();

app.use(cors());  // Habilita o CORS para todas as rotas
app.use(express.json()); // Permite receber JSON no body das requisições

const connection = require("./database/database");
const { Usuario, sincronizarUsuario } = require("./database/usuarios");
const { Livro, sincronizarLivro } = require("./database/livros");

const start = async () => {
    try {
        await connection.authenticate();
        console.log("Conexão estabelecida com sucesso.");

        await sincronizarUsuario();
        console.log("Tabela 'usuarios' sincronizada.");

        await sincronizarLivro();
        console.log("Tabela 'livros' sincronizada.");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error.message);
    }
};

start();

// ===============================
// 📌 ROTAS PARA USUÁRIOS
// ===============================

// Criar um usuário
app.post("/usuarios", async (req, res) => {
    try {
        const { nome } = req.body;
        const usuario = await Usuario.create({ nome });
        res.status(201).json(usuario);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

// Buscar todos os usuários
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

// Buscar um usuário pelo ID
app.get("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

// Atualizar um usuário
app.put("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        usuario.nome = req.body.nome || usuario.nome;
        await usuario.save();

        res.status(200).json({ message: "Usuário atualizado com sucesso", usuario });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

// Deletar um usuário
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await usuario.destroy();
        res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ error: "Erro ao excluir usuário" });
    }
});

// ===============================
// 📌 ROTAS PARA LIVROS
// ===============================

// Buscar todos os livros com os dados do usuário
// Rota para listar todos os livros
app.get("/livros", async (req, res) => {
  try {
    const livros = await Livro.findAll({
      include: {
        model: Usuario,
        attributes: ["id", "nome"],
      },
    });
    res.status(200).json(livros);
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res.status(500).json({ error: "Erro ao buscar livros", details: error.message });
  }
});

// Rota para criar um livro
app.post("/livros", async (req, res) => {
  try {
    const { titulo, autor, genero, status_leitura, usuarioId } = req.body;

    if (!titulo || !autor || !genero || !status_leitura || !usuarioId) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const livro = await Livro.create({
      titulo,
      autor,
      genero,
      status_leitura,
      usuarioId
    });

    res.status(201).json(livro);
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res.status(500).json({ error: "Erro ao criar livro", details: error.message });
  }
});

// Rota para atualizar um livro
app.put("/livros/:id", async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);

    if (!livro) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    const { titulo, autor, genero, status_leitura, usuarioId } = req.body;

    if (!titulo || !autor || !genero || !status_leitura || !usuarioId) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    await livro.update({
      titulo,
      autor,
      genero,
      status_leitura,
      usuarioId
    });

    res.status(200).json(livro);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ error: "Erro ao atualizar livro", details: error.message });
  }
});

// Rota para excluir um livro
app.delete("/livros/:id", async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);

    if (!livro) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    await livro.destroy();
    res.status(200).json({ message: "Livro excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir livro:", error);
    res.status(500).json({ error: "Erro ao excluir livro", details: error.message });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
