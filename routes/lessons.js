const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database/database');
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lessons');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for educational content
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'audio/mpeg',
      'audio/mp3'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// GET all lessons for a course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    // Verify user has access to this course
    const course = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.courseId]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Students can only see published lessons in active courses
    let sql = `
      SELECT l.*, 
             COUNT(n.id) as notice_count,
             COUNT(f.id) as file_count
      FROM lessons l
      LEFT JOIN notices n ON l.id = n.lesson_id
      LEFT JOIN lesson_files f ON l.id = f.lesson_id
      WHERE l.course_id = ?
    `;

    if (req.user.role === 'student') {
      if (course.status !== 'active') {
        return res.status(403).json({ error: 'Course not available' });
      }
      sql += " AND l.status = 'published'";
    }

    sql += " GROUP BY l.id ORDER BY l.lesson_order ASC";

    const lessons = await db.all(sql, [req.params.courseId]);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET lesson by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lesson = await db.get(`
      SELECT l.*, c.title as course_title, c.teacher_id
      FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = ?
    `, [req.params.id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Students can only see published lessons
    if (req.user.role === 'student' && lesson.status !== 'published') {
      return res.status(403).json({ error: 'Lesson not available' });
    }

    // Get notices for this lesson
    const notices = await db.all(`
      SELECT * FROM notices 
      WHERE lesson_id = ? 
      ORDER BY created_at DESC
    `, [req.params.id]);

    // Get files for this lesson
    const files = await db.all(`
      SELECT * FROM lesson_files 
      WHERE lesson_id = ? 
      ORDER BY uploaded_at DESC
    `, [req.params.id]);

    lesson.notices = notices;
    lesson.files = files;

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE lesson (Teachers only)
router.post('/', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { course_id, title, description, content, slides_url, video_url, lesson_order = 1, status = 'draft' } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ error: 'Course ID and title are required' });
    }

    // Verify course exists and user has permission
    const course = await db.get('SELECT * FROM courses WHERE id = ?', [course_id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Teachers can only create lessons for their own courses (unless admin)
    if (req.user.role === 'teacher' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const result = await db.run(
      'INSERT INTO lessons (course_id, title, description, content, slides_url, video_url, lesson_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [course_id, title, description, content, slides_url, video_url, lesson_order, status]
    );

    const lesson = await db.get('SELECT * FROM lessons WHERE id = ?', [result.id]);
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE lesson (Teachers only)
router.put('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { title, description, content, slides_url, video_url, lesson_order, status } = req.body;

    const lesson = await db.get(`
      SELECT l.*, c.teacher_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = ?
    `, [req.params.id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Teachers can only update their own lessons (unless admin)
    if (req.user.role === 'teacher' && lesson.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await db.run(
      `UPDATE lessons 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           content = COALESCE(?, content),
           slides_url = COALESCE(?, slides_url),
           video_url = COALESCE(?, video_url),
           lesson_order = COALESCE(?, lesson_order),
           status = COALESCE(?, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, content, slides_url, video_url, lesson_order, status, req.params.id]
    );

    const updatedLesson = await db.get('SELECT * FROM lessons WHERE id = ?', [req.params.id]);
    res.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE lesson (Teachers only)
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const lesson = await db.get(`
      SELECT l.*, c.teacher_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = ?
    `, [req.params.id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Teachers can only delete their own lessons (unless admin)
    if (req.user.role === 'teacher' && lesson.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await db.run('DELETE FROM lessons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload file to lesson (Teachers only)
router.post('/:id/upload', authenticateToken, requireTeacher, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const lesson = await db.get(`
      SELECT l.*, c.teacher_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = ?
    `, [req.params.id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Teachers can only upload to their own lessons (unless admin)
    if (req.user.role === 'teacher' && lesson.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const result = await db.run(
      'INSERT INTO lesson_files (lesson_id, filename, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, req.file.filename, req.file.originalname, req.file.path, req.file.mimetype, req.file.size]
    );

    const file = await db.get('SELECT * FROM lesson_files WHERE id = ?', [result.id]);
    res.status(201).json(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file from lesson
router.get('/:id/files/:fileId/download', authenticateToken, requireStudent, async (req, res) => {
  try {
    const file = await db.get(`
      SELECT f.*, l.status as lesson_status, c.status as course_status
      FROM lesson_files f
      JOIN lessons l ON f.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE f.id = ? AND f.lesson_id = ?
    `, [req.params.fileId, req.params.id]);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Students can only download files from published lessons in active courses
    if (req.user.role === 'student') {
      if (file.lesson_status !== 'published' || file.course_status !== 'active') {
        return res.status(403).json({ error: 'File not available' });
      }
    }

    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(file.file_path, file.original_name);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE notice for lesson (Teachers only)
router.post('/:id/notices', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { title, content, priority = 'medium' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const lesson = await db.get(`
      SELECT l.*, c.teacher_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = ?
    `, [req.params.id]);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Teachers can only create notices for their own lessons (unless admin)
    if (req.user.role === 'teacher' && lesson.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const result = await db.run(
      'INSERT INTO notices (lesson_id, title, content, priority) VALUES (?, ?, ?, ?)',
      [req.params.id, title, content, priority]
    );

    const notice = await db.get('SELECT * FROM notices WHERE id = ?', [result.id]);
    res.status(201).json(notice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;