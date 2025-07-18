const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');
const { authenticate, requireTeacher } = require('../middleware/auth');

// Apply authentication to all quiz routes
router.use(authenticate);

// Quiz CRUD routes (Teacher only)
router.get('/', QuizController.getAllQuizzes);
router.get('/:id', QuizController.getQuizById);
router.post('/', requireTeacher, QuizController.createQuiz);
router.put('/:id', requireTeacher, QuizController.updateQuiz);
router.delete('/:id', requireTeacher, QuizController.deleteQuiz);
router.patch('/:id/status', requireTeacher, QuizController.toggleQuizStatus);

// Question management routes (Teacher only)
router.post('/:quizId/questions', requireTeacher, QuizController.addQuestion);
router.put('/:quizId/questions/:questionId', requireTeacher, QuizController.updateQuestion);
router.delete('/:quizId/questions/:questionId', requireTeacher, QuizController.deleteQuestion);

module.exports = router;