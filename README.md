# Satori-Nihongo
Web application that helps users learn Japanese

## Features
- User authentication (register/login)
- Role-based access control (student/instructor)
- Course management with gift codes
- Students can join courses using gift codes
- Instructors can create courses and get gift codes for sharing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/Tamnhhe/Satori-Nihongo.git
cd Satori-Nihongo
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Testing

Run the test suite:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Courses
- `POST /api/courses` - Create a course (instructor only)
- `POST /api/courses/join` - Join a course with gift code
- `GET /api/courses/my-courses` - Get user's enrolled courses
- `GET /api/courses/:id` - Get course details

## User Roles

### Student
- Can register and login
- Can join courses using gift codes
- Can view enrolled courses

### Instructor
- Can register and login
- Can create courses
- Can view created courses
- Get gift codes for course enrollment

## Technology Stack
- Backend: Node.js, Express.js
- Database: SQLite
- Authentication: JWT
- Frontend: HTML, CSS, JavaScript
- Testing: Jest, Supertest
