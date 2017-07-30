const Sequelize = require('sequelize');

const sequelize = require('./../sequelize-config.js');

const Line = sequelize.define('line', {
  top: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  middle: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  bottom: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
  collate: 'utf8_unicode_ci',
});

module.exports = Line;