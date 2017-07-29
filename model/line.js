const Sequelize = require('sequelize');

const sequelize = require('./../sequelize-config.js');

const Line = sequelize.define('line', {
  parent: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  child: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
  collate: 'utf8_unicode_ci',
});

module.exports = Line;