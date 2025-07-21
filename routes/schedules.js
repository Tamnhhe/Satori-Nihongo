const express = require('express');
const db = require('../database/database');
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth');

const router = express.Router();

// GET all schedules (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let sql = `
      SELECT s.*, l.title as lesson_title, c.title as course_title, c.teacher_id,
             COUNT(se.id) as enrolled_count
      FROM schedules s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      LEFT JOIN schedule_enrollments se ON s.id = se.schedule_id AND se.status = 'enrolled'
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by date range if provided
    if (req.query.start_date) {
      sql += " AND s.start_time >= ?";
      params.push(req.query.start_date);
    }
    
    if (req.query.end_date) {
      sql += " AND s.end_time <= ?";
      params.push(req.query.end_date);
    }

    // Teachers can only see their own schedules (unless admin)
    if (req.user.role === 'teacher') {
      sql += " AND c.teacher_id = ?";
      params.push(req.user.id);
    }

    // Students can only see schedules for courses they're enrolled in
    if (req.user.role === 'student') {
      sql += ` AND c.status = 'active' 
               AND l.status = 'published'
               AND EXISTS (
                 SELECT 1 FROM enrollments e 
                 WHERE e.user_id = ? AND e.course_id = c.id AND e.status = 'active'
               )`;
      params.push(req.user.id);
    }

    sql += " GROUP BY s.id ORDER BY s.start_time ASC";

    const schedules = await db.all(sql, params);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET schedule by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const schedule = await db.get(`
      SELECT s.*, l.title as lesson_title, c.title as course_title, c.teacher_id
      FROM schedules s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Check permissions
    if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    if (req.user.role === 'student') {
      // Check if student is enrolled in the course
      const enrollment = await db.get(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = (SELECT course_id FROM lessons WHERE id = ?) AND status = "active"',
        [req.user.id, schedule.lesson_id]
      );
      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }
    }

    // Get enrolled students for this schedule
    const students = await db.all(`
      SELECT u.id, u.username, u.full_name, se.enrolled_at, se.status
      FROM schedule_enrollments se
      JOIN users u ON se.user_id = u.id
      WHERE se.schedule_id = ?
      ORDER BY se.enrolled_at ASC
    `, [req.params.id]);

    schedule.enrolled_students = students;
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE schedule (Teachers only)
router.post('/', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { lesson_id, title, meeting_url, start_time, end_time, max_students = 20, description } = req.body;

    if (!lesson_id || !title || !start_time || !end_time) {
      return res.status(400).json({ error: 'Lesson ID, title, start time, and end time are required' });
    }

    // Verify lesson exists and user has permission
    const lesson = await db.get(`
      SELECT l.*, c.teacher_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = ?
    `, [lesson_id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Teachers can only create schedules for their own lessons (unless admin)
    if (req.user.role === 'teacher' && lesson.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Validate dates
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    
    if (startDate >= endDate) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    if (startDate < new Date()) {
      return res.status(400).json({ error: 'Start time cannot be in the past' });
    }

    const result = await db.run(
      'INSERT INTO schedules (lesson_id, title, meeting_url, start_time, end_time, max_students, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [lesson_id, title, meeting_url, start_time, end_time, max_students, description]
    );

    const schedule = await db.get('SELECT * FROM schedules WHERE id = ?', [result.id]);
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE schedule (Teachers only)
router.put('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { title, meeting_url, start_time, end_time, max_students, description } = req.body;

    const schedule = await db.get(`
      SELECT s.*, l.id as lesson_id, c.teacher_id
      FROM schedules s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Teachers can only update their own schedules (unless admin)
    if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Validate dates if provided
    if (start_time && end_time) {
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      
      if (startDate >= endDate) {
        return res.status(400).json({ error: 'End time must be after start time' });
      }
    }

    await db.run(
      `UPDATE schedules 
       SET title = COALESCE(?, title),
           meeting_url = COALESCE(?, meeting_url),
           start_time = COALESCE(?, start_time),
           end_time = COALESCE(?, end_time),
           max_students = COALESCE(?, max_students),
           description = COALESCE(?, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, meeting_url, start_time, end_time, max_students, description, req.params.id]
    );

    const updatedSchedule = await db.get('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE schedule (Teachers only)
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const schedule = await db.get(`
      SELECT s.*, c.teacher_id
      FROM schedules s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Teachers can only delete their own schedules (unless admin)
    if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await db.run('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add student to schedule (Teachers only)
router.post('/:id/students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const schedule = await db.get(`
      SELECT s.*, c.teacher_id, COUNT(se.id) as current_enrollment
      FROM schedules s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      LEFT JOIN schedule_enrollments se ON s.id = se.schedule_id AND se.status = 'enrolled'
      WHERE s.id = ?
      GROUP BY s.id
    `, [req.params.id]);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Teachers can only add students to their own schedules (unless admin)
    if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Check if schedule is full
    if (schedule.current_enrollment >= schedule.max_students) {
      return res.status(400).json({ error: 'Schedule is full' });
    }

    // Verify student exists and is enrolled in the course
    const student = await db.get(`
      SELECT u.id 
      FROM users u
      JOIN enrollments e ON u.id = e.user_id
      JOIN lessons l ON e.course_id = l.course_id
      WHERE u.id = ? AND u.role = 'student' AND l.id = ? AND e.status = 'active'
    `, [student_id, schedule.lesson_id]);

    if (!student) {
      return res.status(400).json({ error: 'Student not found or not enrolled in this course' });
    }

    // Check if student is already enrolled in this schedule
    const existing = await db.get(
      'SELECT id FROM schedule_enrollments WHERE user_id = ? AND schedule_id = ?',
      [student_id, req.params.id]
    );

    if (existing) {
      return res.status(400).json({ error: 'Student already enrolled in this schedule' });
    }

    await db.run(
      'INSERT INTO schedule_enrollments (user_id, schedule_id) VALUES (?, ?)',
      [student_id, req.params.id]
    );

    res.json({ message: 'Student added to schedule successfully' });
  } catch (error) {
    console.error('Error adding student to schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join schedule (Students only)
router.post('/:id/join', authenticateToken, requireStudent, async (req, res) => {
  try {
    const schedule = await db.get(`
      SELECT s.*, COUNT(se.id) as current_enrollment
      FROM schedules s
      LEFT JOIN schedule_enrollments se ON s.id = se.schedule_id AND se.status = 'enrolled'
      WHERE s.id = ?
      GROUP BY s.id
    `, [req.params.id]);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Check if student is enrolled in the course
    const enrollment = await db.get(`
      SELECT e.id 
      FROM enrollments e
      JOIN lessons l ON e.course_id = l.course_id
      WHERE e.user_id = ? AND l.id = ? AND e.status = 'active'
    `, [req.user.id, schedule.lesson_id]);

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Check if schedule is full
    if (schedule.current_enrollment >= schedule.max_students) {
      return res.status(400).json({ error: 'Schedule is full' });
    }

    // Check if already joined
    const existing = await db.get(
      'SELECT id FROM schedule_enrollments WHERE user_id = ? AND schedule_id = ?',
      [req.user.id, req.params.id]
    );

    if (existing) {
      return res.status(400).json({ error: 'Already joined this schedule' });
    }

    await db.run(
      'INSERT INTO schedule_enrollments (user_id, schedule_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );

    res.json({ message: 'Successfully joined the schedule' });
  } catch (error) {
    console.error('Error joining schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my schedule (Students)
router.get('/my/calendar', authenticateToken, requireStudent, async (req, res) => {
  try {
    const schedules = await db.all(`
      SELECT s.*, l.title as lesson_title, c.title as course_title, se.enrolled_at
      FROM schedule_enrollments se
      JOIN schedules s ON se.schedule_id = s.id
      JOIN lessons l ON s.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE se.user_id = ? AND se.status = 'enrolled'
      ORDER BY s.start_time ASC
    `, [req.user.id]);

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching student calendar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;