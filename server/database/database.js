const { Sequelize } = require("sequelize");

const conection = new Sequelize("mybookstore","root","123456789",{
    host: "localhost",
    dialect: "mysql",
});

module.exports = conection;