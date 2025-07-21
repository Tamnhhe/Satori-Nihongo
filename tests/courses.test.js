const request = require('supertest');
const app = require('../backend/server');
const db = require('../backend/config/database');

describe('Course API', () => {
  let studentToken, instructorToken;

  beforeEach(async () => {
    // Clear database before each test
    await new Promise((resolve) => {
      db.serialize(() => {
        db.run('DELETE FROM enrollments', () => {
          db.run('DELETE FROM courses', () => {
            db.run('DELETE FROM users', resolve);
          });
        });
      });
    });

    // Register student and instructor
    const studentData = {
      username: 'student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    };

    const instructorData = {
      username: 'instructor',
      email: 'instructor@example.com',
      password: 'password123',
      role: 'instructor'
    };

    const studentResponse = await request(app)
      .post('/api/auth/register')
      .send(studentData);
    studentToken = studentResponse.body.token;

    const instructorResponse = await request(app)
      .post('/api/auth/register')
      .send(instructorData);
    instructorToken = instructorResponse.body.token;
  });

  afterAll((done) => {
    db.close(done);
  });

  describe('POST /api/courses', () => {
    it('should allow instructor to create a course', async () => {
      const courseData = {
        title: 'Japanese Basics',
        description: 'Learn basic Japanese'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body.message).toBe('Course created successfully');
      expect(response.body.course.title).toBe(courseData.title);
      expect(response.body.course.gift_code).toBeDefined();
    });

    it('should not allow student to create a course', async () => {
      const courseData = {
        title: 'Japanese Basics',
        description: 'Learn basic Japanese'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(courseData)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('POST /api/courses/join', () => {
    let giftCode;

    beforeEach(async () => {
      // Create a course first
      const courseData = {
        title: 'Japanese Basics',
        description: 'Learn basic Japanese'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(courseData);

      giftCode = response.body.course.gift_code;
    });

    it('should allow student to join course with valid gift code', async () => {
      const response = await request(app)
        .post('/api/courses/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ giftCode })
        .expect(200);

      expect(response.body.message).toBe('Successfully joined the course');
      expect(response.body.course.title).toBe('Japanese Basics');
    });

    it('should not allow joining with invalid gift code', async () => {
      const response = await request(app)
        .post('/api/courses/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ giftCode: 'INVALID' })
        .expect(404);

      expect(response.body.error).toBe('Invalid gift code or course not found');
    });

    it('should not allow joining same course twice', async () => {
      // Join once
      await request(app)
        .post('/api/courses/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ giftCode })
        .expect(200);

      // Try to join again
      const response = await request(app)
        .post('/api/courses/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ giftCode })
        .expect(400);

      expect(response.body.error).toBe('You are already enrolled in this course');
    });
  });

  describe('GET /api/courses/my-courses', () => {
    it('should return user courses', async () => {
      // Create and join a course
      const courseData = {
        title: 'Japanese Basics',
        description: 'Learn basic Japanese'
      };

      const createResponse = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(courseData);

      const giftCode = createResponse.body.course.gift_code;

      await request(app)
        .post('/api/courses/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ giftCode });

      // Get user courses
      const response = await request(app)
        .get('/api/courses/my-courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].title).toBe('Japanese Basics');
    });
  });
});