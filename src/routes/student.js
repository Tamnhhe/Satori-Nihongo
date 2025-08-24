const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const { authenticate, requireStudent } = require('../middleware/auth');

// Apply authentication to all student routes
router.use(authenticate);
router.use(requireStudent);

// Quiz taking routes
router.get('/quizzes', StudentController.getAvailableQuizzes);
router.post('/quizzes/:quizId/attempt', StudentController.startQuizAttempt);
router.patch('/attempts/:attemptId/answer', StudentController.submitAnswer);
router.post('/attempts/:attemptId/complete', StudentController.completeQuizAttempt);

// History and results
router.get('/history', StudentController.getQuizHistory);
router.get('/attempts/:attemptId', StudentController.getAttemptDetails);

// Study tools
router.get('/flashcards', StudentController.createFlashcards);
router.post('/practice-test', StudentController.createPracticeTest);

module.exports = router;