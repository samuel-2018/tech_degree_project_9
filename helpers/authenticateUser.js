// Provides authorization functionality
const auth = require('basic-auth');

// Enables hashing of passwords
// ( for comparison against stored hashed password)
const bcryptjs = require('bcryptjs');

// Database access
const { sequelize, models } = require('../db');

const { User } = models;

// Error: Authentication Failed
const error401 = new Error('Authentication Failed.');
error401.status = 401;

// Note: Must use async/await.

const authenticateUser = async (req, res, next) => {
  // Basic Authentication Authorization header value.
  // User's key and secret.
  const credentials = auth(req);

  // Got credentials?
  if (credentials) {
    try {
      // User
      const user = await User.findOne({ where: { emailAddress: credentials.name } });

      // Got user?
      if (user) {
        const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

        // Got authenticated?
        if (authenticated) {
          // Stores the authenticated user on req.
          // All middleware will have access to it.
          req.currentUser = user;
          next();
        } else {
          // return res.status(401);
          return next(error401);
        }
      } else {
        // return res.status(401);
        return next(error401);
      }
    } catch (error) {
      // return res.send(error);
      return next(error);
    }
  } else {
    return next(error401);
  }
};

module.exports = authenticateUser;
