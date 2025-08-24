const { QuizAttempt } = require('../models/Quiz');
const dataStore = require('../models/DataStore');

class StudentController {
  // Get available quizzes for student
  async getAvailableQuizzes(req, res) {
    try {
      const quizzes = await dataStore.getQuizzes();
      const activeQuizzes = quizzes.filter(quiz => quiz.isActive);
      
      // Return quizzes without correct answers
      const sanitizedQuizzes = activeQuizzes.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options,
          points: q.points,
          order: q.order
          // Exclude correctAnswer and explanation
        }))
      }));
      
      res.json({ success: true, data: sanitizedQuizzes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Start a quiz attempt
  async startQuizAttempt(req, res) {
    try {
      const { quizId } = req.params;
      const { userId } = req.user || {};
      
      const quiz = await dataStore.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      if (!quiz.isActive) {
        return res.status(400).json({ success: false, error: 'Quiz is not active' });
      }
      
      // Check if student already has an incomplete attempt
      const existingAttempts = await dataStore.getAttemptsByStudent(userId);
      const incompleteAttempt = existingAttempts.find(
        attempt => attempt.quizId === quizId && !attempt.isCompleted
      );
      
      if (incompleteAttempt) {
        return res.json({ 
          success: true, 
          data: incompleteAttempt,
          message: 'Resuming existing attempt'
        });
      }
      
      const attemptData = {
        quizId,
        studentId: userId,
        answers: {},
        score: 0,
        totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
        startedAt: new Date().toISOString(),
        isCompleted: false
      };
      
      const newAttempt = await dataStore.createAttempt(attemptData);
      res.status(201).json({ success: true, data: newAttempt });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Submit answer for a question
  async submitAnswer(req, res) {
    try {
      const { attemptId } = req.params;
      const { questionId, answer } = req.body;
      const { userId } = req.user || {};
      
      const attempts = await dataStore.getAttempts();
      const attempt = attempts.find(a => a.id === attemptId && a.studentId === userId);
      
      if (!attempt) {
        return res.status(404).json({ success: false, error: 'Attempt not found' });
      }
      
      if (attempt.isCompleted) {
        return res.status(400).json({ success: false, error: 'Attempt already completed' });
      }
      
      // Update answer
      const updatedAnswers = { ...attempt.answers, [questionId]: answer };
      const updatedAttempt = await dataStore.updateAttempt(attemptId, {
        answers: updatedAnswers
      });
      
      res.json({ success: true, data: updatedAttempt });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Complete quiz attempt
  async completeQuizAttempt(req, res) {
    try {
      const { attemptId } = req.params;
      const { userId } = req.user || {};
      
      const attempts = await dataStore.getAttempts();
      const attempt = attempts.find(a => a.id === attemptId && a.studentId === userId);
      
      if (!attempt) {
        return res.status(404).json({ success: false, error: 'Attempt not found' });
      }
      
      if (attempt.isCompleted) {
        return res.status(400).json({ success: false, error: 'Attempt already completed' });
      }
      
      const quiz = await dataStore.getQuizById(attempt.quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // Calculate score
      const attemptInstance = new QuizAttempt(attempt);
      const percentage = attemptInstance.calculateScore(quiz);
      
      const updatedAttempt = await dataStore.updateAttempt(attemptId, {
        score: attemptInstance.score,
        totalPoints: attemptInstance.totalPoints,
        completedAt: new Date().toISOString(),
        isCompleted: true
      });
      
      res.json({ 
        success: true, 
        data: updatedAttempt,
        percentage: Math.round(percentage * 100) / 100
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get student's quiz history
  async getQuizHistory(req, res) {
    try {
      const { userId } = req.user || {};
      const attempts = await dataStore.getAttemptsByStudent(userId);
      
      // Get quiz details for each attempt
      const historyWithQuizData = await Promise.all(
        attempts.map(async (attempt) => {
          const quiz = await dataStore.getQuizById(attempt.quizId);
          return {
            ...attempt,
            quizTitle: quiz ? quiz.title : 'Unknown Quiz',
            quizDescription: quiz ? quiz.description : ''
          };
        })
      );
      
      res.json({ success: true, data: historyWithQuizData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get specific attempt details
  async getAttemptDetails(req, res) {
    try {
      const { attemptId } = req.params;
      const { userId } = req.user || {};
      
      const attempts = await dataStore.getAttempts();
      const attempt = attempts.find(a => a.id === attemptId && a.studentId === userId);
      
      if (!attempt) {
        return res.status(404).json({ success: false, error: 'Attempt not found' });
      }
      
      const quiz = await dataStore.getQuizById(attempt.quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      
      // If attempt is completed, include correct answers for review
      let detailedResults = null;
      if (attempt.isCompleted) {
        detailedResults = quiz.questions.map(question => ({
          question: question.question,
          userAnswer: attempt.answers[question.id] || 'No answer',
          correctAnswer: question.correctAnswer,
          isCorrect: attempt.answers[question.id] === question.correctAnswer,
          points: question.points,
          explanation: question.explanation
        }));
      }
      
      res.json({ 
        success: true, 
        data: {
          attempt,
          quiz: {
            title: quiz.title,
            description: quiz.description
          },
          results: detailedResults
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create flashcards from completed quizzes
  async createFlashcards(req, res) {
    try {
      const { userId } = req.user || {};
      const attempts = await dataStore.getAttemptsByStudent(userId);
      const completedAttempts = attempts.filter(a => a.isCompleted);
      
      const flashcards = [];
      
      for (const attempt of completedAttempts) {
        const quiz = await dataStore.getQuizById(attempt.quizId);
        if (!quiz) continue;
        
        quiz.questions.forEach(question => {
          const wasIncorrect = attempt.answers[question.id] !== question.correctAnswer;
          flashcards.push({
            id: `${attempt.id}-${question.id}`,
            question: question.question,
            answer: question.correctAnswer,
            explanation: question.explanation,
            quizTitle: quiz.title,
            wasIncorrect,
            difficulty: wasIncorrect ? 'hard' : 'easy'
          });
        });
      }
      
      res.json({ success: true, data: flashcards });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create practice test with AI (simplified mock for now)
  async createPracticeTest(req, res) {
    try {
      const { topic, difficulty, questionCount } = req.body;
      
      // Mock AI-generated questions (in reality, this would call an AI service)
      const mockQuestions = [];
      for (let i = 0; i < (questionCount || 5); i++) {
        mockQuestions.push({
          id: `practice-${Date.now()}-${i}`,
          type: 'multiple_choice',
          question: `Sample ${topic} question ${i + 1} (${difficulty} level)`,
          options: [
            'Sample answer A',
            'Sample answer B (correct)',
            'Sample answer C',
            'Sample answer D'
          ],
          correctAnswer: 'Sample answer B (correct)',
          points: 1,
          explanation: `This is a sample explanation for ${topic} question ${i + 1}`,
          order: i
        });
      }
      
      const practiceQuiz = {
        id: `practice-${Date.now()}`,
        title: `AI Practice Test: ${topic}`,
        description: `Auto-generated ${difficulty} level practice test for ${topic}`,
        teacherId: 'ai-system',
        isActive: true,
        timeLimit: null,
        questions: mockQuestions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPracticeTest: true
      };
      
      res.json({ success: true, data: practiceQuiz });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new StudentController();