const db = require('../config/database');

class Course {
  static async create(courseData) {
    const { title, description, instructor_id, gift_code } = courseData;
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO courses (title, description, instructor_id, gift_code)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([title, description, instructor_id, gift_code], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, description, instructor_id, gift_code });
        }
      });
      
      stmt.finalize();
    });
  }

  static async findByGiftCode(giftCode) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM courses WHERE gift_code = ? AND is_active = 1',
        [giftCode],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM courses WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async enrollStudent(userId, courseId) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO enrollments (user_id, course_id)
        VALUES (?, ?)
      `);
      
      stmt.run([userId, courseId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, userId, courseId });
        }
      });
      
      stmt.finalize();
    });
  }

  static async getUserCourses(userId) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, e.enrolled_at 
        FROM courses c 
        JOIN enrollments e ON c.id = e.course_id 
        WHERE e.user_id = ?
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Course;