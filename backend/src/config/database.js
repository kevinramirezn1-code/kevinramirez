const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false
    },
    timezone: '-05:00',

    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  }
);

module.exports = sequelize;