const Sequelize = require("sequelize");
const connection = require("./database");

const Usuario = connection.define("usuarios", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // Outros campos do usuário
}, {
  tableName: "usuarios",
  timestamps: false,
});

// Função para sincronizar a tabela de usuários
async function sincronizarUsuario() {
  try {
    await Usuario.sync({ force: false });
    console.log("Tabela 'usuarios' sincronizada.");
  } catch (error) {
    console.error("Erro ao sincronizar a tabela de usuários: ", error);
  }
}

// Exportando o modelo e a função
module.exports = { Usuario, sincronizarUsuario };
