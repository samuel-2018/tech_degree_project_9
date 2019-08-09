const express = require('express');

const router = express.Router();

// Sanitization middlewares
const { sanitizeBody } = require('express-validator');
const { sanitizeParam } = require('express-validator');

// Database access
const { models } = require('../db');

const { Course } = models;

// ========================================
//  HELPER FUNCTIONS
// ========================================

// Error: Course not found
const courseNotFound = new Error('Course not found.');
courseNotFound.status = 404;

// Error: Forbidden
const forbidden = new Error('Forbidden.');
forbidden.status = 403;

// Authenticate user
const authenticateUser = require('../helpers/authenticateUser');

// Authenticate access
const authenticateAccess = async (req, res, next) => {
  try {
    // Get course
    // IMPORTANT: Checks 'id' in params NOT 'id' in client JSON.
    // (For reliablity and security, use one source of truth for 'id'.)
    const course = await Course.findByPk(req.params.id);

    // Does course exist?
    if (course) {
      // Get current authenticated user
      const user = await req.currentUser.dataValues.id;

      // Get course owner
      const courseOwner = await course.dataValues.userId;

      // Is this the owner of the course?
      if (courseOwner === user) {
        // Owner
        return next();
      }
      // Not owner
      return next(forbidden);
    }
    return next(courseNotFound);
  } catch (error) {
    // Handles Sequelize errors
    return next(error);
  }
};

// ========================================
// ROUTES
// ========================================

// Sanitize user input
// (Will mutate data)
router.use([
  sanitizeBody(['title', 'estimatedTime', 'materialsNeeded', 'description'])
    .trim()
    .escape(),
  sanitizeParam(['id'])
    .trim()
    .escape(),
]);

// ROUTE - api/courses
router
  .route('/')

  // GET - List of courses
  .get(async (req, res, next) => {
    //
    try {
      // All courses, data includes userId
      const result = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      res.status(200).json(result);
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Bad Request
        // msg assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  })

  // POST - Create a course
  .post(authenticateUser, async (req, res, next) => {
    try {
      // Creates and saves new course
      const course = await Course.create(req.body);

      // Gets course ID
      const courseId = course.dataValues.id;

      res.writeHead(201, {
        // URI for the course
        Location: `/api/courses/${courseId}`,
      });
      res.end();
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Bad Request
        // Message assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  });

// ROUTE - api/courses/#
router
  .route('/:id')
  // GET - One course
  .get(async (req, res, next) => {
    try {
      console.log(req.params.id);

      // course, data includes userId
      const result = await Course.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (result) {
        // Returns course
        res.status(200).json(result);
      } else {
        next(courseNotFound);
      }
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Bad Request
        // msg assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  })

  // PUT - Update a course
  .put(authenticateUser, authenticateAccess, async (req, res, next) => {
    try {
      // Get course
      // IMPORTANT: Gets 'id' in params NOT 'id' in client JSON.
      // (For reliablity and security, use one source of truth for 'id'.)
      const course = await Course.findByPk(req.params.id);

      // Does course exist?
      if (course) {
        // IMPORTANT: Sequalize 'update' doesn't reliably validate.
        // Course needs 'built' and then manually validated
        // before calling update.

        // DANGER: Don't build an instance with client supplied data
        // with the setting "isNewRecord: false", and then call save.
        // This can result in the client/JSON supplied course 'id'
        // number being used instead of the number set here.
        // (Gaining access to a different record.)

        // Builds the course using client sent data.
        const updatedCourse = await Course.build(req.body);

        // Validates manually.
        await updatedCourse.validate();

        // Update
        // (If client supplies an 'id' property in JSON,
        // it will be safely ignored by update.)
        await course.update(req.body);

        // Success
        res.status(204).end();
      } else {
        // No such course
        next(courseNotFound);
      }
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Bad Request
        // Message assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  })

  // DELETE - One course
  .delete(authenticateUser, authenticateAccess, async (req, res, next) => {
    try {
      // Get course
      const course = await Course.findByPk(req.params.id);

      // Does course exist?
      if (course) {
        // Delete
        await course.destroy(req.body);
      } else {
        // No such course
        next(courseNotFound);
      }
      // Success
      res.writeHead(204, {
        // BUG? '/' is the project requirement... but '/api' would be more useful
        // https://app.slack.com/client/TBPQFGEAH/CBPRYGLSZ/thread/CBPRYGLSZ-1563967481.032400
        Location: '/',
      });
      res.end();
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Bad Request
        // Message assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  });

module.exports = router;
