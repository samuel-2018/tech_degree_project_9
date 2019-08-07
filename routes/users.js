const express = require('express');

const router = express.Router();

// Database access
const { sequelize, models } = require('../db');

const { User } = models;

// Sequelize operators
const { Op } = sequelize;

router
  .route('/')
  // Get current authenticated user
  .get(async (req, res, next) => {
    //
  })
  // Create user
  .post(async (req, res, next) => {
    try {
      await User.create(req.body);

      res.writeHead(201, {
        Location: '/',
      });
      res.end();
    } catch (error) {
      res.send(error);
    }
  });

module.exports = router;
