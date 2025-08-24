// Global state
let currentUser = null;
let currentQuizAttempt = null;

// API helper function
async function apiCall(endpoint, options = {}) {
    const url = `/api${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(currentUser && {
                'x-user-id': currentUser.id,
                'x-user-role': currentUser.role
            })
        }
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.error || 'API call failed');
    }
    
    return data;
}

// User login
function loginAs(role) {
    currentUser = {
        id: role === 'teacher' ? 'teacher1' : 'student1',
        role: role
    };
    
    document.getElementById('user-selection').style.display = 'none';
    
    if (role === 'teacher') {
        document.getElementById('teacher-dashboard').style.display = 'block';
        loadQuizzes();
    } else {
        document.getElementById('student-dashboard').style.display = 'block';
        loadAvailableQuizzes();
    }
}

// Teacher functions
function showCreateQuiz() {
    const form = document.getElementById('create-quiz-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function createQuiz(event) {
    event.preventDefault();
    
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;
    const timeLimit = document.getElementById('quiz-time-limit').value;
    
    try {
        const quiz = await apiCall('/quizzes', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                timeLimit: timeLimit ? parseInt(timeLimit) : null,
                questions: []
            })
        });
        
        showMessage('Quiz created successfully!', 'success');
        document.getElementById('create-quiz-form').style.display = 'none';
        document.getElementById('quiz-title').value = '';
        document.getElementById('quiz-description').value = '';
        document.getElementById('quiz-time-limit').value = '';
        loadQuizzes();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadQuizzes() {
    try {
        const response = await apiCall('/quizzes');
        const quizzes = response.data;
        
        const container = document.getElementById('quiz-list');
        container.innerHTML = '<h3>My Quizzes</h3>';
        
        if (quizzes.length === 0) {
            container.innerHTML += '<p>No quizzes created yet.</p>';
            return;
        }
        
        quizzes.forEach(quiz => {
            const quizDiv = document.createElement('div');
            quizDiv.className = 'quiz-item';
            quizDiv.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>${quiz.description}</p>
                <p><strong>Questions:</strong> ${quiz.questions.length} | <strong>Status:</strong> ${quiz.isActive ? 'Active' : 'Inactive'}</p>
                <div class="quiz-actions">
                    <button onclick="toggleQuizStatus('${quiz.id}', ${!quiz.isActive})" class="btn ${quiz.isActive ? 'btn-secondary' : 'btn-success'}">
                        ${quiz.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onclick="showAddQuestion('${quiz.id}')" class="btn btn-primary">Add Question</button>
                    <button onclick="viewQuizDetails('${quiz.id}')" class="btn btn-secondary">View Details</button>
                </div>
                <div id="add-question-${quiz.id}" style="display: none; margin-top: 1rem;">
                    <h5>Add Question</h5>
                    <form onsubmit="addQuestion(event, '${quiz.id}')">
                        <input type="text" placeholder="Question text" required name="question">
                        <select name="type">
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="short_answer">Short Answer</option>
                        </select>
                        <input type="text" placeholder="Option A" name="optionA">
                        <input type="text" placeholder="Option B" name="optionB">
                        <input type="text" placeholder="Option C" name="optionC">
                        <input type="text" placeholder="Option D" name="optionD">
                        <input type="text" placeholder="Correct Answer" required name="correctAnswer">
                        <input type="number" placeholder="Points" value="1" name="points">
                        <textarea placeholder="Explanation (optional)" name="explanation"></textarea>
                        <button type="submit" class="btn btn-primary">Add Question</button>
                    </form>
                </div>
            `;
            container.appendChild(quizDiv);
        });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function showAddQuestion(quizId) {
    const form = document.getElementById(`add-question-${quizId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function addQuestion(event, quizId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const options = [];
    if (formData.get('optionA')) options.push(formData.get('optionA'));
    if (formData.get('optionB')) options.push(formData.get('optionB'));
    if (formData.get('optionC')) options.push(formData.get('optionC'));
    if (formData.get('optionD')) options.push(formData.get('optionD'));
    
    try {
        await apiCall(`/quizzes/${quizId}/questions`, {
            method: 'POST',
            body: JSON.stringify({
                type: formData.get('type'),
                question: formData.get('question'),
                options: options,
                correctAnswer: formData.get('correctAnswer'),
                points: parseInt(formData.get('points')),
                explanation: formData.get('explanation')
            })
        });
        
        showMessage('Question added successfully!', 'success');
        document.getElementById(`add-question-${quizId}`).style.display = 'none';
        loadQuizzes();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function toggleQuizStatus(quizId, isActive) {
    try {
        await apiCall(`/quizzes/${quizId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive })
        });
        
        showMessage(`Quiz ${isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
        loadQuizzes();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Student functions
async function loadAvailableQuizzes() {
    try {
        const response = await apiCall('/student/quizzes');
        const quizzes = response.data;
        
        const container = document.getElementById('available-quizzes');
        container.innerHTML = '<h3>Available Quizzes</h3>';
        
        if (quizzes.length === 0) {
            container.innerHTML += '<p>No active quizzes available.</p>';
            return;
        }
        
        quizzes.forEach(quiz => {
            const quizDiv = document.createElement('div');
            quizDiv.className = 'quiz-item';
            quizDiv.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>${quiz.description}</p>
                <p><strong>Questions:</strong> ${quiz.questions.length} ${quiz.timeLimit ? `| <strong>Time Limit:</strong> ${quiz.timeLimit} minutes` : ''}</p>
                <div class="quiz-actions">
                    <button onclick="startQuiz('${quiz.id}')" class="btn btn-primary">Start Quiz</button>
                </div>
            `;
            container.appendChild(quizDiv);
        });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function startQuiz(quizId) {
    try {
        const response = await apiCall(`/student/quizzes/${quizId}/attempt`, {
            method: 'POST'
        });
        
        currentQuizAttempt = response.data;
        
        // Get quiz details
        const quizResponse = await apiCall(`/quizzes/${quizId}`);
        const quiz = quizResponse.data;
        
        showQuizTaking(quiz);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function showQuizTaking(quiz) {
    document.getElementById('student-dashboard').style.display = 'none';
    document.getElementById('quiz-taking').style.display = 'block';
    
    const container = document.getElementById('quiz-content');
    container.innerHTML = `
        <h3>${quiz.title}</h3>
        <p>${quiz.description}</p>
        <div id="questions-container"></div>
        <button onclick="completeQuiz()" class="btn btn-success">Complete Quiz</button>
        <button onclick="goBackToStudent()" class="btn btn-secondary">Back to Dashboard</button>
    `;
    
    const questionsContainer = document.getElementById('questions-container');
    
    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        let optionsHtml = '';
        if (question.type === 'multiple_choice') {
            optionsHtml = question.options.map(option => `
                <label>
                    <input type="radio" name="question-${question.id}" value="${option}">
                    ${option}
                </label>
            `).join('');
        } else if (question.type === 'true_false') {
            optionsHtml = `
                <label>
                    <input type="radio" name="question-${question.id}" value="True">
                    True
                </label>
                <label>
                    <input type="radio" name="question-${question.id}" value="False">
                    False
                </label>
            `;
        } else {
            optionsHtml = `<input type="text" name="question-${question.id}" placeholder="Your answer">`;
        }
        
        questionDiv.innerHTML = `
            <h5>Question ${index + 1}: ${question.question}</h5>
            <div class="question-options">
                ${optionsHtml}
            </div>
            <p><strong>Points:</strong> ${question.points}</p>
        `;
        
        questionsContainer.appendChild(questionDiv);
    });
}

async function completeQuiz() {
    try {
        // Collect answers
        const questions = document.querySelectorAll('.question-item');
        
        for (const questionDiv of questions) {
            const questionId = questionDiv.querySelector('input').name.replace('question-', '');
            let answer = '';
            
            const radioInput = questionDiv.querySelector('input[type="radio"]:checked');
            const textInput = questionDiv.querySelector('input[type="text"]');
            
            if (radioInput) {
                answer = radioInput.value;
            } else if (textInput) {
                answer = textInput.value;
            }
            
            if (answer) {
                await apiCall(`/student/attempts/${currentQuizAttempt.id}/answer`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        questionId,
                        answer
                    })
                });
            }
        }
        
        // Complete the attempt
        const response = await apiCall(`/student/attempts/${currentQuizAttempt.id}/complete`, {
            method: 'POST'
        });
        
        showResults(response.data, response.percentage);
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function showResults(attempt, percentage) {
    document.getElementById('quiz-taking').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    const container = document.getElementById('results-content');
    container.innerHTML = `
        <div class="score-display">
            <div class="score-circle">
                ${percentage.toFixed(1)}%
            </div>
            <p><strong>Score:</strong> ${attempt.score} out of ${attempt.totalPoints} points</p>
            <p><strong>Completed:</strong> ${new Date(attempt.completedAt).toLocaleString()}</p>
        </div>
        <button onclick="goBackToStudent()" class="btn btn-primary">Back to Dashboard</button>
        <button onclick="loadHistory()" class="btn btn-secondary">View History</button>
    `;
}

function goBackToStudent() {
    document.getElementById('quiz-taking').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('student-dashboard').style.display = 'block';
    currentQuizAttempt = null;
}

async function loadHistory() {
    try {
        const response = await apiCall('/student/history');
        const attempts = response.data;
        
        const container = document.getElementById('quiz-history');
        container.innerHTML = '<h3>Quiz History</h3>';
        
        if (attempts.length === 0) {
            container.innerHTML += '<p>No quiz attempts yet.</p>';
            return;
        }
        
        attempts.forEach(attempt => {
            const percentage = attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints * 100).toFixed(1) : 0;
            const attemptDiv = document.createElement('div');
            attemptDiv.className = 'quiz-item';
            attemptDiv.innerHTML = `
                <h4>${attempt.quizTitle}</h4>
                <p><strong>Score:</strong> ${attempt.score}/${attempt.totalPoints} (${percentage}%)</p>
                <p><strong>Completed:</strong> ${attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : 'In Progress'}</p>
                <p><strong>Status:</strong> ${attempt.isCompleted ? 'Completed' : 'In Progress'}</p>
            `;
            container.appendChild(attemptDiv);
        });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadFlashcards() {
    try {
        const response = await apiCall('/student/flashcards');
        const flashcards = response.data;
        
        const container = document.getElementById('flashcards');
        container.innerHTML = '<h3>Study Flashcards</h3>';
        
        if (flashcards.length === 0) {
            container.innerHTML += '<p>Complete some quizzes to generate flashcards!</p>';
            return;
        }
        
        flashcards.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'flashcard';
            cardDiv.onclick = () => flipCard(index);
            cardDiv.id = `flashcard-${index}`;
            cardDiv.innerHTML = `
                <div class="card-front">
                    <h4>${card.question}</h4>
                    <p><small>From: ${card.quizTitle}</small></p>
                    <p><small>Click to reveal answer</small></p>
                </div>
                <div class="card-back" style="display: none;">
                    <h4>Answer:</h4>
                    <p><strong>${card.answer}</strong></p>
                    ${card.explanation ? `<p><em>${card.explanation}</em></p>` : ''}
                    <p><small>Difficulty: ${card.difficulty}</small></p>
                </div>
            `;
            container.appendChild(cardDiv);
        });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function flipCard(index) {
    const card = document.getElementById(`flashcard-${index}`);
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');
    
    if (front.style.display === 'none') {
        front.style.display = 'block';
        back.style.display = 'none';
        card.classList.remove('flipped');
    } else {
        front.style.display = 'none';
        back.style.display = 'block';
        card.classList.add('flipped');
    }
}

function showPracticeTestForm() {
    const form = document.getElementById('practice-test-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function createPracticeTest(event) {
    event.preventDefault();
    
    const topic = document.getElementById('practice-topic').value;
    const difficulty = document.getElementById('practice-difficulty').value;
    const questionCount = document.getElementById('practice-count').value;
    
    try {
        const response = await apiCall('/student/practice-test', {
            method: 'POST',
            body: JSON.stringify({
                topic,
                difficulty,
                questionCount: parseInt(questionCount)
            })
        });
        
        const practiceQuiz = response.data;
        showMessage('Practice test generated successfully!', 'success');
        document.getElementById('practice-test-form').style.display = 'none';
        
        // Show the practice quiz
        showQuizTaking(practiceQuiz);
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Utility functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 5000);
}