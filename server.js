const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const quizRoutes = require('./src/routes/quizzes');
const studentRoutes = require('./src/routes/student');
const { createDemoUser } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/student', studentRoutes);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Satori-Nihongo API',
    version: '1.0.0',
    endpoints: {
      teacher: {
        'GET /api/quizzes': 'Get all quizzes for teacher',
        'POST /api/quizzes': 'Create new quiz',
        'PUT /api/quizzes/:id': 'Update quiz',
        'DELETE /api/quizzes/:id': 'Delete quiz',
        'PATCH /api/quizzes/:id/status': 'Activate/Deactivate quiz',
        'POST /api/quizzes/:quizId/questions': 'Add question to quiz',
        'PUT /api/quizzes/:quizId/questions/:questionId': 'Update question',
        'DELETE /api/quizzes/:quizId/questions/:questionId': 'Delete question'
      },
      student: {
        'GET /api/student/quizzes': 'Get available quizzes',
        'POST /api/student/quizzes/:quizId/attempt': 'Start quiz attempt',
        'PATCH /api/student/attempts/:attemptId/answer': 'Submit answer',
        'POST /api/student/attempts/:attemptId/complete': 'Complete quiz',
        'GET /api/student/history': 'Get quiz history',
        'GET /api/student/attempts/:attemptId': 'Get attempt details',
        'GET /api/student/flashcards': 'Get flashcards',
        'POST /api/student/practice-test': 'Create AI practice test'
      }
    },
    authentication: {
      note: 'For demo purposes, use headers: x-user-id and x-user-role (teacher|student)',
      demo_users: {
        teacher: 'x-user-id: teacher1, x-user-role: teacher',
        student: 'x-user-id: student1, x-user-role: student'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Initialize demo users and start server
async function startServer() {
  try {
    // Ensure dataStore is initialized
    const dataStore = require('./src/models/DataStore');
    await dataStore.initPromise;
    
    // Create demo users
    await createDemoUser('teacher1', 'teacher');
    await createDemoUser('student1', 'student');
    
    app.listen(PORT, () => {
      console.log(`Satori-Nihongo server running on port ${PORT}`);
      console.log(`API documentation: http://localhost:${PORT}/api`);
      console.log(`Web interface: http://localhost:${PORT}`);
      console.log('\nDemo credentials:');
      console.log('Teacher: x-user-id: teacher1, x-user-role: teacher');
      console.log('Student: x-user-id: student1, x-user-role: student');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();