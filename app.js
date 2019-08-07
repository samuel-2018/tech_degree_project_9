// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TEMP, move to routes?
const { sequelize, models } = require('./db');
// const { sequelize } = require('./db');

// ****************************** */
// TEMP, move to another location?

// // Imports Sequelize
// const Sequelize = require('sequelize');

// // Creates instance of Sequelize
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'fsjstd-restapi.db',
// });

// // Test connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection successful!');
//   } catch (error) {
//     console.log('OOOOPS');
//   }
// })();
// ************************* */

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});