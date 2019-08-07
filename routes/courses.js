const express = require('express');

const router = express.Router();

// router.use(express.json());

// Database access
const { sequelize, models } = require('../db');

const { Course } = models;

// Sequelize operators
const { Op } = sequelize;

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
      res.send(error);
    }
  })
  // Create a course
  .post(async (req, res, next) => {
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
      res.send(error);
    }
  });

// ROUTE: api/courses/#
router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      // course, data includes userId
      const result = await Course.findByPk(req.params.id);

      res.status(200).json(result);
    } catch (error) {
      res.send(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      // course
      const course = await Course.findByPk(req.params.id);
      // if there is this course
      if (course) {
        // Update
        await course.update(req.body);
      } else {
        // no such course
        res.status(404);
      }
      // Success
      res.status(204).end();
    } catch (error) {
      res.status(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      // course
      const course = await Course.findByPk(req.params.id);
      // if there is this course
      if (course) {
        // Delete
        await course.destroy(req.body);
      } else {
        // no such course
        res.status(404);
      }
      // Success
      res.status(204).end();
    } catch (error) {
      res.status(error);
    }
  });

module.exports = router;
