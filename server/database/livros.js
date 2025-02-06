const Sequelize = require("sequelize");
const connection = require("./database");
const { Usuario } = require("./usuarios");  // Garantir que está desestruturado corretamente

const Livro = connection.define("livros", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  autor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  genero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status_leitura: {
    type: Sequelize.ENUM("Não iniciado","Desejo ler", "Em adamento","Abandonado", "Finalizado"),
    allowNull: false,
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, // Relacionamento com a tabela usuarios
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
}, {
  tableName: "livros",
  timestamps: false,
});

// Criando a relação: Um Usuário pode ter vários Livros
Usuario.hasMany(Livro, { foreignKey: "usuarioId" });
Livro.belongsTo(Usuario, { foreignKey: "usuarioId" });

async function sincronizarLivro() {
  try {
    await Livro.sync({ force: false });
    console.log("Tabela 'livros' sincronizada.");
  } catch (error) {
    console.error("Erro ao sincronizar a tabela de livros: ", error);
  }
}

module.exports = { Livro, sincronizarLivro };
