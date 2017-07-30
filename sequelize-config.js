const Sequelize = require('sequelize');
const credentials = require('./credentials.js');

const sequelize = new Sequelize(credentials.database.name, credentials.database.userName, credentials.database.password, {
  host: credentials.database.host,
  port: credentials.database.port,
  dialect: credentials.database.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: { engine: 'InnoDB' }
});

module.exports = sequelize;