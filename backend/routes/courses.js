const express = require('express');
const Course = require('../models/Course');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create a new course (instructor only)
router.post('/', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }

    // Generate a random gift code
    const giftCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newCourse = await Course.create({
      title,
      description,
      instructor_id: req.user.id,
      gift_code: giftCode
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join course with gift code (students)
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { giftCode } = req.body;

    if (!giftCode) {
      return res.status(400).json({ error: 'Gift code is required' });
    }

    // Find course by gift code
    const course = await Course.findByGiftCode(giftCode);
    if (!course) {
      return res.status(404).json({ error: 'Invalid gift code or course not found' });
    }

    // Enroll student in course
    try {
      await Course.enrollStudent(req.user.id, course.id);
      res.json({
        message: 'Successfully joined the course',
        course: {
          id: course.id,
          title: course.title,
          description: course.description
        }
      });
    } catch (enrollError) {
      if (enrollError.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: 'You are already enrolled in this course' });
      }
      throw enrollError;
    }
  } catch (error) {
    console.error('Course join error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's courses
router.get('/my-courses', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.getUserCourses(req.user.id);
    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get course details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;