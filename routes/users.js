// Enables hashing of passwords
const bcryptjs = require('bcryptjs');

const express = require('express');

const router = express.Router();

// Database access
const { sequelize, models } = require('../db');

const { User } = models;

// Sequelize operators
const { Op } = sequelize;

// ========================================
//  HELPER FUNCTIONS
// ========================================
const authenticateUser = require('../helpers/authenticateUser');
// ========================================
// ROUTES
// ========================================

router
  .route('/')
  // Get current authenticated user
  .get(authenticateUser, async (req, res, next) => {
    //
    const user = await req.currentUser;

    res.json({ user });
  })
  // Create user
  .post(async (req, res, next) => {
    try {
      // Builds new user
      const newUser = await User.build(req.body);

      // Hashes password
      newUser.password = await bcryptjs.hashSync(newUser.password);

      // Save
      await newUser.save(req.body);

      res.writeHead(201, {
        Location: '/',
      });
      res.end();
    } catch (error) {
      res.send(error);
    }
  });

module.exports = router;
