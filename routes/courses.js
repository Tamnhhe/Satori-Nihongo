const express = require('express');
const db = require('../database/database');
const { authenticateToken, requireAdmin, requireTeacher, requireStudent } = require('../middleware/auth');

const router = express.Router();

// GET all courses (available to all authenticated users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let sql = `
      SELECT c.*, u.full_name as teacher_name 
      FROM courses c 
      LEFT JOIN users u ON c.teacher_id = u.id
    `;
    
    // Students can only see active courses
    if (req.user.role === 'student') {
      sql += " WHERE c.status = 'active'";
    }
    
    sql += " ORDER BY c.created_at DESC";
    
    const courses = await db.all(sql);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await db.get(`
      SELECT c.*, u.full_name as teacher_name 
      FROM courses c 
      LEFT JOIN users u ON c.teacher_id = u.id 
      WHERE c.id = ?
    `, [req.params.id]);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Students can only see active courses
    if (req.user.role === 'student' && course.status !== 'active') {
      return res.status(403).json({ error: 'Course not available' });
    }

    // Get lessons for this course
    const lessons = await db.all(`
      SELECT * FROM lessons 
      WHERE course_id = ? 
      ORDER BY lesson_order ASC
    `, [req.params.id]);

    course.lessons = lessons;
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE course (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, teacher_id, level = 'beginner', status = 'draft' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }

    // Verify teacher exists if teacher_id is provided
    if (teacher_id) {
      const teacher = await db.get('SELECT id FROM users WHERE id = ? AND role = "teacher"', [teacher_id]);
      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher ID' });
      }
    }

    const result = await db.run(
      'INSERT INTO courses (title, description, teacher_id, level, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, teacher_id, level, status]
    );

    const course = await db.get('SELECT * FROM courses WHERE id = ?', [result.id]);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE course (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, teacher_id, level, status } = req.body;

    const course = await db.get('SELECT id FROM courses WHERE id = ?', [req.params.id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Verify teacher exists if teacher_id is provided
    if (teacher_id) {
      const teacher = await db.get('SELECT id FROM users WHERE id = ? AND role = "teacher"', [teacher_id]);
      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher ID' });
      }
    }

    await db.run(
      `UPDATE courses 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           teacher_id = COALESCE(?, teacher_id), 
           level = COALESCE(?, level), 
           status = COALESCE(?, status),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, teacher_id, level, status, req.params.id]
    );

    const updatedCourse = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE course (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const course = await db.get('SELECT id FROM courses WHERE id = ?', [req.params.id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await db.run('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET enrolled students for a course (Admin and Teachers)
router.get('/:id/students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const students = await db.all(`
      SELECT u.id, u.username, u.email, u.full_name, e.enrolled_at, e.status
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = ? AND u.role = 'student'
      ORDER BY e.enrolled_at DESC
    `, [req.params.id]);

    res.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll student in course (Admin and Teachers)
router.post('/:id/enroll', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    // Verify student exists
    const student = await db.get('SELECT id FROM users WHERE id = ? AND role = "student"', [student_id]);
    if (!student) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    // Check if already enrolled
    const existing = await db.get(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [student_id, req.params.id]
    );

    if (existing) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    await db.run(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [student_id, req.params.id]
    );

    res.json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;