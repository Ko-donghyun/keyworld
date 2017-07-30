const Sequelize = require('sequelize');

const sequelize = require('./../sequelize-config.js');

const Keyword = sequelize.define('keyword', {
  label: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
  collate: 'utf8_unicode_ci',
});

module.exports = Keyword;