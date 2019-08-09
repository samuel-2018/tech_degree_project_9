// Provides authorization functionality
const auth = require('basic-auth');

// Enables hashing of passwords
// (For comparison against stored hashed password)
const bcryptjs = require('bcryptjs');

// Database access
const { models } = require('../db');

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
      // Get hashed password
      const passwordHash = await User.findOne({
        where: { emailAddress: credentials.name },
        attributes: ['password'],
      });

      // Got passwordHash?
      if (passwordHash) {
        const authenticated = bcryptjs.compareSync(credentials.pass, passwordHash.password);

        // Got authenticated?
        if (authenticated) {
          // The database is queried a second time
          // to get user data without the password.
          // Why? 'await delete user.password' did not work.

          // Get user
          const user = await User.findOne({
            where: { emailAddress: credentials.name },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
          });

          // Stores the authenticated user on req.
          // All middleware will have access to it.
          req.currentUser = user;
          next();
        } else {
          return next(error401);
        }
      } else {
        return next(error401);
      }
    } catch (error) {
      return next(error);
    }
  } else {
    return next(error401);
  }
};

module.exports = authenticateUser;
