const express = require('express');

const router = express.Router();

// router.use(express.json());

// Database access
const { sequelize, models } = require('../db');

const { Course, User } = models;

// Sequelize operators
const { Op } = sequelize;

// ========================================
//  HELPER FUNCTIONS
// ========================================

// Authenticate user
const authenticateUser = require('../helpers/authenticateUser');

// Error: Course not found
const courseNotFound = new Error('Course not found.');
courseNotFound.status = 404;

// Error: Forbidden
const forbidden = new Error('Forbidden.');
forbidden.status = 403;

// Authenticate access
const authenticateAccess = async (req, res, next) => {
  try {
    // Get course
    // IMPORTANT: Checks 'id' in params NOT 'id' in client JSON.
    const course = await Course.findByPk(req.params.id);

    // if there is this course
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

// ROUTE: api/courses
router
  .route('/')
  // Get list of courses
  .get(async (req, res, next) => {
    //
    try {
      // All courses, data includes userId
      const result = await Course.findAll();

      res.status(200).json(result);
    } catch (error) {
      // res.send(error);
      next(error);
    }
  })
  // Create a course
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
      // res.send(error);
      next(error);
    }
  });

// ROUTE: api/courses/#
router
  .route('/:id')
  // GET course
  .get(async (req, res, next) => {
    try {
      // course, data includes userId
      const result = await Course.findByPk(req.params.id);

      res.status(200).json(result);
    } catch (error) {
      // res.send(error);
      next(error);
    }
  })
  // UPDATE course
  .put(authenticateUser, authenticateAccess, async (req, res, next) => {
    try {
      // course
      const course = await Course.findByPk(req.params.id);

      // if there is this course
      if (course) {
        // IMPORTANT: Sequalize 'update' doesn't reliably validate.
        // Course needs 'built' and then manually validated
        // before calling update.

        // DANGER: Don't build an instance with client supplied data
        // with the setting "isNewRecord: false", and then call save on it.
        // This can result in the client supplied 'id' number being used
        // instead of the number set here. (Gaining access to a different record.)

        // Builds the course using client sent data.
        const updatedCourse = await Course.build(req.body);

        // Validates manually.
        await updatedCourse.validate();

        // Update
        await course.update(req.body);

        // Success
        res.status(204).end();
      } else {
        // no such course
        next(courseNotFound);
      }
    } catch (error) {
      // res.status(error);
      next(error);
    }
  })
  // DELETE course
  .delete(authenticateUser, authenticateAccess, async (req, res, next) => {
    try {
      // course
      const course = await Course.findByPk(req.params.id);
      // if there is this course
      if (course) {
        // Delete
        await course.destroy(req.body);
      } else {
        // no such course
        next(courseNotFound);
      }
      // Success
      res.status(204).end();
      // TO DO Does the location header need set to '/'?
      // It does need to go to the home route
      // https://app.slack.com/client/TBPQFGEAH/CBPRYGLSZ/thread/CBPRYGLSZ-1563967481.032400
    } catch (error) {
      // res.status(error);
      next(error);
    }
  });

module.exports = router;
