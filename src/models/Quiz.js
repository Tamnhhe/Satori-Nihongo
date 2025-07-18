// Quiz Schema Definition
class Quiz {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.teacherId = data.teacherId || null;
    this.isActive = data.isActive || false;
    this.timeLimit = data.timeLimit || null; // in minutes
    this.questions = data.questions || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    if (!this.title.trim()) errors.push('Title is required');
    if (!this.teacherId) errors.push('Teacher ID is required');
    if (this.questions.length === 0) errors.push('At least one question is required');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class Question {
  constructor(data) {
    this.id = data.id || null;
    this.quizId = data.quizId || null;
    this.type = data.type || 'multiple_choice'; // multiple_choice, true_false, short_answer
    this.question = data.question || '';
    this.options = data.options || []; // for multiple choice
    this.correctAnswer = data.correctAnswer || '';
    this.points = data.points || 1;
    this.explanation = data.explanation || '';
    this.order = data.order || 0;
  }

  validate() {
    const errors = [];
    if (!this.question.trim()) errors.push('Question text is required');
    if (!this.correctAnswer.trim()) errors.push('Correct answer is required');
    if (this.type === 'multiple_choice' && this.options.length < 2) {
      errors.push('Multiple choice questions need at least 2 options');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.role = data.role || 'student'; // teacher, student
    this.name = data.name || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

class QuizAttempt {
  constructor(data) {
    this.id = data.id || null;
    this.quizId = data.quizId || null;
    this.studentId = data.studentId || null;
    this.answers = data.answers || {}; // { questionId: answer }
    this.score = data.score || 0;
    this.totalPoints = data.totalPoints || 0;
    this.startedAt = data.startedAt || new Date().toISOString();
    this.completedAt = data.completedAt || null;
    this.isCompleted = data.isCompleted || false;
  }

  calculateScore(quiz) {
    let correctAnswers = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach(question => {
      totalPoints += question.points;
      if (this.answers[question.id] === question.correctAnswer) {
        correctAnswers += question.points;
      }
    });

    this.score = correctAnswers;
    this.totalPoints = totalPoints;
    return (correctAnswers / totalPoints) * 100;
  }
}

module.exports = {
  Quiz,
  Question,
  User,
  QuizAttempt
};