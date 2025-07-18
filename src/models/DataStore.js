const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class DataStore {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.initialized = false;
    this.initPromise = this.init();
  }

  async init() {
    if (this.initialized) return;
    
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }

    // Initialize empty files if they don't exist
    const files = ['quizzes.json', 'users.json', 'attempts.json'];
    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
      }
    }
    
    this.initialized = true;
  }

  async readFile(filename) {
    await this.initPromise;
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async writeFile(filename, data) {
    await this.initPromise;
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  // Quiz operations
  async getQuizzes() {
    return await this.readFile('quizzes.json');
  }

  async getQuizById(id) {
    const quizzes = await this.getQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  }

  async getQuizzesByTeacher(teacherId) {
    const quizzes = await this.getQuizzes();
    return quizzes.filter(quiz => quiz.teacherId === teacherId);
  }

  async createQuiz(quizData) {
    const quizzes = await this.getQuizzes();
    const newQuiz = { ...quizData, id: uuidv4() };
    quizzes.push(newQuiz);
    await this.writeFile('quizzes.json', quizzes);
    return newQuiz;
  }

  async updateQuiz(id, updateData) {
    const quizzes = await this.getQuizzes();
    const index = quizzes.findIndex(quiz => quiz.id === id);
    if (index === -1) return null;
    
    quizzes[index] = { ...quizzes[index], ...updateData, updatedAt: new Date().toISOString() };
    await this.writeFile('quizzes.json', quizzes);
    return quizzes[index];
  }

  async deleteQuiz(id) {
    const quizzes = await this.getQuizzes();
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== id);
    if (filteredQuizzes.length === quizzes.length) return false;
    
    await this.writeFile('quizzes.json', filteredQuizzes);
    return true;
  }

  // User operations
  async getUsers() {
    return await this.readFile('users.json');
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username) {
    const users = await this.getUsers();
    return users.find(user => user.username === username);
  }

  async createUser(userData) {
    const users = await this.getUsers();
    const newUser = { ...userData, id: uuidv4() };
    users.push(newUser);
    await this.writeFile('users.json', users);
    return newUser;
  }

  // Quiz attempt operations
  async getAttempts() {
    return await this.readFile('attempts.json');
  }

  async getAttemptsByStudent(studentId) {
    const attempts = await this.getAttempts();
    return attempts.filter(attempt => attempt.studentId === studentId);
  }

  async getAttemptsByQuiz(quizId) {
    const attempts = await this.getAttempts();
    return attempts.filter(attempt => attempt.quizId === quizId);
  }

  async createAttempt(attemptData) {
    const attempts = await this.getAttempts();
    const newAttempt = { ...attemptData, id: uuidv4() };
    attempts.push(newAttempt);
    await this.writeFile('attempts.json', attempts);
    return newAttempt;
  }

  async updateAttempt(id, updateData) {
    const attempts = await this.getAttempts();
    const index = attempts.findIndex(attempt => attempt.id === id);
    if (index === -1) return null;
    
    attempts[index] = { ...attempts[index], ...updateData };
    await this.writeFile('attempts.json', attempts);
    return attempts[index];
  }
}

module.exports = new DataStore();