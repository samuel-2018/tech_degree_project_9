const fs = require('fs');
const path = require('path');

// Imports Sequelize
const Sequelize = require('sequelize');

// Creates instance of Sequelize
const sequelize = new Sequelize({
  // Options
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
});

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection successful!');
  } catch (error) {
    console.log('Connection failed.');
  }
})();

const models = {};

// Boilerplate code adapted from express generator AND TreeHouse example 'data relationships'
// Import models
fs.readdirSync(path.join(__dirname, 'models')).forEach((file) => {
  const model = sequelize.import(path.join(__dirname, 'models', file));
  models[model.name] = model;
});
// Create associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  models,
};
