const dataStore = require('../models/DataStore');

// Simple authentication middleware (in production, use proper JWT/session management)
async function authenticate(req, res, next) {
  try {
    // For demo purposes, we'll use a simple user ID and role from headers
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    
    if (!userId || !userRole) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required. Please provide x-user-id and x-user-role headers.' 
      });
    }
    
    // In a real application, verify the user exists and the token is valid
    req.user = {
      userId,
      role: userRole
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
}

// Authorization middleware for teachers only
function requireTeacher(req, res, next) {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Teacher access required' });
  }
}

// Authorization middleware for students only
function requireStudent(req, res, next) {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Student access required' });
  }
}

// Create a demo user if it doesn't exist
async function createDemoUser(username, role) {
  const existingUser = await dataStore.getUserByUsername(username);
  if (!existingUser) {
    return await dataStore.createUser({
      username,
      email: `${username}@demo.com`,
      role,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    });
  }
  return existingUser;
}

module.exports = {
  authenticate,
  requireTeacher,
  requireStudent,
  createDemoUser
};