// Global variables
let currentUser = null;
let token = localStorage.getItem('token');

// API Base URL
const API_BASE = '/api';

// Modal functionality
window.showModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

window.hideModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    if (token) {
        verifyToken();
    } else {
        showLogin();
    }
});

function setupEventListeners() {
    // Auth navigation buttons
    document.getElementById('loginBtn')?.addEventListener('click', showLogin);
    document.getElementById('registerBtn')?.addEventListener('click', showRegister);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Auth form toggles
    document.getElementById('showRegisterBtn')?.addEventListener('click', showRegister);
    document.getElementById('showLoginBtn')?.addEventListener('click', showLogin);
    
    // Form submissions
    document.getElementById('loginFormElement')?.addEventListener('submit', login);
    document.getElementById('registerFormElement')?.addEventListener('submit', register);
    document.getElementById('courseModal')?.querySelector('form')?.addEventListener('submit', saveCourse);
    
    // Course management
    document.getElementById('addCourseBtn')?.addEventListener('click', showAddCourseModal);
    document.getElementById('courseModalClose')?.addEventListener('click', () => hideModal('courseModal'));
    document.getElementById('courseModalCancel')?.addEventListener('click', () => hideModal('courseModal'));
    
    // Event delegation for dynamic buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-course-btn')) {
            const courseId = e.target.closest('.view-course-btn').dataset.courseId;
            viewCourse(parseInt(courseId));
        }
        
        if (e.target.closest('.delete-course-btn')) {
            const courseId = e.target.closest('.delete-course-btn').dataset.courseId;
            deleteCourse(parseInt(courseId));
        }
        
        if (e.target.closest('.view-lesson-btn')) {
            const lessonId = e.target.closest('.view-lesson-btn').dataset.lessonId;
            viewLesson(parseInt(lessonId));
        }
        
        if (e.target.closest('.join-schedule-btn')) {
            const scheduleId = e.target.closest('.join-schedule-btn').dataset.scheduleId;
            joinSchedule(parseInt(scheduleId));
        }
        
        if (e.target.closest('.delete-schedule-btn')) {
            const scheduleId = e.target.closest('.delete-schedule-btn').dataset.scheduleId;
            deleteSchedule(parseInt(scheduleId));
        }
        
        if (e.target.closest('.modal-close-btn')) {
            e.target.closest('.modal').remove();
        }
    });
}

// Authentication functions
async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showApp();
            showAlert('Login successful!', 'success');
        } else {
            showAlert(data.error, 'danger');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'danger');
    }
}

async function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const full_name = document.getElementById('regFullName').value;
    const role = document.getElementById('regRole').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, full_name, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showApp();
            showAlert('Registration successful!', 'success');
        } else {
            showAlert(data.error, 'danger');
        }
    } catch (error) {
        showAlert('Registration failed. Please try again.', 'danger');
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showApp();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    showAuth();
}

// UI Functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
}

function showAuth() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('appContent').classList.add('hidden');
    document.getElementById('navAuth').classList.remove('hidden');
    document.getElementById('navUser').classList.add('hidden');
}

function showApp() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('appContent').classList.remove('hidden');
    document.getElementById('navAuth').classList.add('hidden');
    document.getElementById('navUser').classList.remove('hidden');
    
    document.getElementById('userName').textContent = currentUser.full_name;
    document.getElementById('userRole').textContent = currentUser.role;
    
    // Show/hide admin features
    if (currentUser.role === 'admin') {
        document.getElementById('addCourseBtn').classList.remove('hidden');
    }
    
    // Show/hide teacher features
    if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
        document.getElementById('addLessonBtn').classList.remove('hidden');
        document.getElementById('addScheduleBtn').classList.remove('hidden');
    }
    
    loadCourses();
    loadLessons();
    loadSchedules();
    loadCalendar();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// API Functions
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(`${API_BASE}${url}`, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }
    
    return data;
}

// Course functions
async function loadCourses() {
    try {
        const courses = await apiRequest('/courses');
        displayCourses(courses);
    } catch (error) {
        showAlert('Failed to load courses: ' + error.message, 'danger');
    }
}

function displayCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-4 mb-3';
        courseCard.innerHTML = `
            <div class="card course-card">
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text">${course.description || 'No description'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${course.status === 'active' ? 'success' : 'secondary'}">${course.status}</span>
                        <span class="badge bg-info">${course.level}</span>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">Teacher: ${course.teacher_name || 'Not assigned'}</small>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary btn-sm view-course-btn" data-course-id="${course.id}">
                            <span class="fa-eye"></span> View
                        </button>
                        ${currentUser.role === 'admin' ? `
                            <button class="btn btn-danger btn-sm delete-course-btn" data-course-id="${course.id}">
                                <span class="fa-trash"></span> Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        coursesList.appendChild(courseCard);
    });
}

async function viewCourse(courseId) {
    try {
        const course = await apiRequest(`/courses/${courseId}`);
        showCourseDetails(course);
    } catch (error) {
        showAlert('Failed to load course details: ' + error.message, 'danger');
    }
}

function showCourseDetails(course) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal show';
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${course.title}</h5>
                    <button type="button" class="btn-close modal-close-btn">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>Description:</strong> ${course.description || 'No description'}</p>
                    <p><strong>Level:</strong> ${course.level}</p>
                    <p><strong>Status:</strong> ${course.status}</p>
                    <p><strong>Teacher:</strong> ${course.teacher_name || 'Not assigned'}</p>
                    
                    <h6>Lessons:</h6>
                    <div class="list-group">
                        ${course.lessons.map(lesson => `
                            <div class="list-group-item">
                                <h6>${lesson.title}</h6>
                                <p class="mb-1">${lesson.description || 'No description'}</p>
                                <small>Status: ${lesson.status}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    modalDiv.addEventListener('click', (e) => {
        if (e.target === modalDiv) {
            modalDiv.remove();
        }
    });
}

function showAddCourseModal() {
    window.showModal('courseModal');
}

// Make functions globally available
window.showAddCourseModal = showAddCourseModal;

async function saveCourse(event) {
    event.preventDefault();
    
    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDescription').value;
    const level = document.getElementById('courseLevel').value;
    const status = document.getElementById('courseStatus').value;
    
    try {
        await apiRequest('/courses', {
            method: 'POST',
            body: JSON.stringify({ title, description, level, status })
        });
        
        showAlert('Course created successfully!', 'success');
        window.hideModal('courseModal');
        loadCourses();
        
        // Reset form
        document.getElementById('courseTitle').value = '';
        document.getElementById('courseDescription').value = '';
    } catch (error) {
        showAlert('Failed to create course: ' + error.message, 'danger');
    }
}

async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            await apiRequest(`/courses/${courseId}`, {
                method: 'DELETE'
            });
            
            showAlert('Course deleted successfully!', 'success');
            loadCourses();
        } catch (error) {
            showAlert('Failed to delete course: ' + error.message, 'danger');
        }
    }
}

// Lesson functions
async function loadLessons() {
    try {
        const courses = await apiRequest('/courses');
        displayLessons(courses);
    } catch (error) {
        showAlert('Failed to load lessons: ' + error.message, 'danger');
    }
}

function displayLessons(courses) {
    const lessonsList = document.getElementById('lessonsList');
    lessonsList.innerHTML = '';
    
    courses.forEach(course => {
        const courseSection = document.createElement('div');
        courseSection.className = 'mb-4';
        courseSection.innerHTML = `
            <h5>${course.title}</h5>
            <div class="list-group" id="lessons-${course.id}">
                <div class="text-muted">Loading lessons...</div>
            </div>
        `;
        lessonsList.appendChild(courseSection);
        
        loadCourseLessons(course.id);
    });
}

async function loadCourseLessons(courseId) {
    try {
        const lessons = await apiRequest(`/lessons/course/${courseId}`);
        const lessonsContainer = document.getElementById(`lessons-${courseId}`);
        
        if (lessons.length === 0) {
            lessonsContainer.innerHTML = '<div class="text-muted">No lessons found</div>';
            return;
        }
        
        lessonsContainer.innerHTML = lessons.map(lesson => `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>${lesson.title}</h6>
                        <p class="mb-1">${lesson.description || 'No description'}</p>
                        <small>Status: ${lesson.status} | Order: ${lesson.lesson_order}</small>
                    </div>
                    <div>
                        <button class="btn btn-primary btn-sm view-lesson-btn" data-lesson-id="${lesson.id}">
                            <span class="fa-eye"></span> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById(`lessons-${courseId}`).innerHTML = '<div class="text-danger">Failed to load lessons</div>';
    }
}

async function viewLesson(lessonId) {
    try {
        const lesson = await apiRequest(`/lessons/${lessonId}`);
        showLessonDetails(lesson);
    } catch (error) {
        showAlert('Failed to load lesson details: ' + error.message, 'danger');
    }
}

function showLessonDetails(lesson) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal show';
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${lesson.title}</h5>
                    <button type="button" class="btn-close modal-close-btn">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>Course:</strong> ${lesson.course_title}</p>
                    <p><strong>Description:</strong> ${lesson.description || 'No description'}</p>
                    ${lesson.content ? `<div><strong>Content:</strong><br>${lesson.content}</div>` : ''}
                    ${lesson.slides_url ? `<p><strong>Slides:</strong> <a href="${lesson.slides_url}" target="_blank">View Slides</a></p>` : ''}
                    ${lesson.video_url ? `<p><strong>Video:</strong> <a href="${lesson.video_url}" target="_blank">Watch Video</a></p>` : ''}
                    
                    <h6>Notices:</h6>
                    <div class="list-group mb-3">
                        ${lesson.notices.map(notice => `
                            <div class="list-group-item">
                                <h6>${notice.title} <span class="badge ${notice.priority === 'high' ? 'bg-danger' : notice.priority === 'medium' ? 'bg-warning' : 'bg-secondary'}">${notice.priority}</span></h6>
                                <p class="mb-1">${notice.content}</p>
                                <small>${new Date(notice.created_at).toLocaleDateString()}</small>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h6>Files:</h6>
                    <div class="list-group">
                        ${lesson.files.map(file => `
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${file.original_name}</strong>
                                    <br><small>${(file.file_size / 1024 / 1024).toFixed(2)} MB</small>
                                </div>
                                <a href="/api/lessons/${lesson.id}/files/${file.id}/download" class="btn btn-sm btn-primary">
                                    <span class="fa-download"></span> Download
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    modalDiv.addEventListener('click', (e) => {
        if (e.target === modalDiv) {
            modalDiv.remove();
        }
    });
}

// Schedule functions
async function loadSchedules() {
    try {
        const schedules = await apiRequest('/schedules');
        displaySchedules(schedules);
    } catch (error) {
        showAlert('Failed to load schedules: ' + error.message, 'danger');
    }
}

function displaySchedules(schedules) {
    const schedulesList = document.getElementById('schedulesList');
    schedulesList.innerHTML = '';
    
    if (schedules.length === 0) {
        schedulesList.innerHTML = '<div class="text-muted">No schedules found</div>';
        return;
    }
    
    schedules.forEach(schedule => {
        const scheduleCard = document.createElement('div');
        scheduleCard.className = 'card mb-3';
        scheduleCard.innerHTML = `
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h5>${schedule.title}</h5>
                        <p class="mb-1"><strong>Course:</strong> ${schedule.course_title}</p>
                        <p class="mb-1"><strong>Lesson:</strong> ${schedule.lesson_title}</p>
                        <p class="mb-1"><strong>Time:</strong> ${new Date(schedule.start_time).toLocaleString()} - ${new Date(schedule.end_time).toLocaleString()}</p>
                        <p class="mb-1"><strong>Enrolled:</strong> ${schedule.enrolled_count}/${schedule.max_students}</p>
                        ${schedule.meeting_url ? `<p class="mb-1"><strong>Meeting:</strong> <a href="${schedule.meeting_url}" target="_blank">Join Meeting</a></p>` : ''}
                    </div>
                    <div class="col-md-4 text-end">
                        ${currentUser.role === 'student' ? `
                            <button class="btn btn-success btn-sm join-schedule-btn" data-schedule-id="${schedule.id}">
                                <span class="fa-calendar-plus"></span> Join
                            </button>
                        ` : ''}
                        ${currentUser.role === 'admin' || currentUser.role === 'teacher' ? `
                            <button class="btn btn-danger btn-sm delete-schedule-btn" data-schedule-id="${schedule.id}">
                                <span class="fa-trash"></span> Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        schedulesList.appendChild(scheduleCard);
    });
}

async function joinSchedule(scheduleId) {
    try {
        await apiRequest(`/schedules/${scheduleId}/join`, {
            method: 'POST'
        });
        
        showAlert('Successfully joined the schedule!', 'success');
        loadSchedules();
        loadCalendar();
    } catch (error) {
        showAlert('Failed to join schedule: ' + error.message, 'danger');
    }
}

async function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        try {
            await apiRequest(`/schedules/${scheduleId}`, {
                method: 'DELETE'
            });
            
            showAlert('Schedule deleted successfully!', 'success');
            loadSchedules();
        } catch (error) {
            showAlert('Failed to delete schedule: ' + error.message, 'danger');
        }
    }
}

// Calendar functions
async function loadCalendar() {
    if (currentUser.role !== 'student') {
        document.getElementById('calendarView').innerHTML = '<div class="text-muted">Calendar view is only available for students</div>';
        return;
    }
    
    try {
        const schedules = await apiRequest('/schedules/my/calendar');
        displayCalendar(schedules);
    } catch (error) {
        showAlert('Failed to load calendar: ' + error.message, 'danger');
    }
}

function displayCalendar(schedules) {
    const calendarView = document.getElementById('calendarView');
    
    if (schedules.length === 0) {
        calendarView.innerHTML = '<div class="text-muted">No scheduled meetings found</div>';
        return;
    }
    
    const upcomingSchedules = schedules.filter(s => new Date(s.start_time) > new Date());
    
    calendarView.innerHTML = `
        <h5>Upcoming Meetings</h5>
        <div class="list-group">
            ${upcomingSchedules.map(schedule => `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>${schedule.title}</h6>
                            <p class="mb-1">${schedule.course_title} - ${schedule.lesson_title}</p>
                            <small>${new Date(schedule.start_time).toLocaleString()}</small>
                        </div>
                        <div>
                            ${schedule.meeting_url ? `
                                <a href="${schedule.meeting_url}" target="_blank" class="btn btn-success btn-sm">
                                    <span class="fa-video"></span> Join Meeting
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}