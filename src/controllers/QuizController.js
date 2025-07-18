const { Quiz, Question } = require('../models/Quiz');
const dataStore = require('../models/DataStore');

class QuizController {
  // Get all quizzes (for admin) or teacher's quizzes
  async getAllQuizzes(req, res) {
    try {
      const { role, userId } = req.user || {};
      let quizzes;
      
      if (role === 'teacher') {
        quizzes = await dataStore.getQuizzesByTeacher(userId);
      } else {
        quizzes = await dataStore.getQuizzes();
      }
      
      res.json({ success: true, data: quizzes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get quiz by ID
  async getQuizById(req, res) {
    try {
      const { id } = req.params;
      const quiz = await dataStore.getQuizById(id);
      
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      res.json({ success: true, data: quiz });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new quiz
  async createQuiz(req, res) {
    try {
      const { userId } = req.user || {};
      const quizData = { ...req.body, teacherId: userId };
      
      const quiz = new Quiz(quizData);
      const validation = quiz.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        });
      }
      
      const newQuiz = await dataStore.createQuiz(quiz);
      res.status(201).json({ success: true, data: newQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update quiz
  async updateQuiz(req, res) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user || {};
      
      const existingQuiz = await dataStore.getQuizById(id);
      if (!existingQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to update this quiz
      if (role !== 'admin' && existingQuiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const updatedQuiz = await dataStore.updateQuiz(id, req.body);
      res.json({ success: true, data: updatedQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete quiz
  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user || {};
      
      const existingQuiz = await dataStore.getQuizById(id);
      if (!existingQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to delete this quiz
      if (role !== 'admin' && existingQuiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const deleted = await dataStore.deleteQuiz(id);
      if (deleted) {
        res.json({ success: true, message: 'Quiz deleted successfully' });
      } else {
        res.status(404).json({ success: false, error: 'Quiz not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Activate/Deactivate quiz
  async toggleQuizStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const { userId, role } = req.user || {};
      
      const existingQuiz = await dataStore.getQuizById(id);
      if (!existingQuiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to activate this quiz
      if (role !== 'admin' && existingQuiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const updatedQuiz = await dataStore.updateQuiz(id, { isActive });
      res.json({ success: true, data: updatedQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Add question to quiz
  async addQuestion(req, res) {
    try {
      const { quizId } = req.params;
      const { userId, role } = req.user || {};
      
      const quiz = await dataStore.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to modify this quiz
      if (role !== 'admin' && quiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const questionData = { ...req.body, quizId, order: quiz.questions.length };
      const question = new Question(questionData);
      const validation = question.validate();
      
      if (!validation.isValid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        });
      }
      
      question.id = require('uuid').v4();
      quiz.questions.push(question);
      
      const updatedQuiz = await dataStore.updateQuiz(quizId, { questions: quiz.questions });
      res.status(201).json({ success: true, data: question });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update question in quiz
  async updateQuestion(req, res) {
    try {
      const { quizId, questionId } = req.params;
      const { userId, role } = req.user || {};
      
      const quiz = await dataStore.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to modify this quiz
      if (role !== 'admin' && quiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const questionIndex = quiz.questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }
      
      quiz.questions[questionIndex] = { ...quiz.questions[questionIndex], ...req.body };
      
      const updatedQuiz = await dataStore.updateQuiz(quizId, { questions: quiz.questions });
      res.json({ success: true, data: quiz.questions[questionIndex] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete question from quiz
  async deleteQuestion(req, res) {
    try {
      const { quizId, questionId } = req.params;
      const { userId, role } = req.user || {};
      
      const quiz = await dataStore.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Check if user has permission to modify this quiz
      if (role !== 'admin' && quiz.teacherId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const originalLength = quiz.questions.length;
      quiz.questions = quiz.questions.filter(q => q.id !== questionId);
      
      if (quiz.questions.length === originalLength) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }
      
      const updatedQuiz = await dataStore.updateQuiz(quizId, { questions: quiz.questions });
      res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new QuizController();