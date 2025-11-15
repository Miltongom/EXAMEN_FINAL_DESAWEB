// API Configuration
const API_CONFIG = {
    loginUrl: 'https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate',
    messagesUrl: 'https://backcvbgtmdesa.azurewebsites.net/api/Mensajes',
    getMessagesUrl: 'https://desarrollowebfinal.onrender.com/api/messages'
};

// Application State
let currentUser = null;
let authToken = null;
let messagesPollInterval = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const loginForm = document.getElementById('loginForm');
const messageForm = document.getElementById('messageForm');
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');
const loginError = document.getElementById('loginError');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');
const togglePassword = document.getElementById('togglePassword');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    setupEventListeners();
});

// Check for existing session
function checkExistingSession() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = savedUser;
        showChatScreen();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Message form
    messageForm.addEventListener('submit', handleSendMessage);

    // Logout button
    logoutBtn.addEventListener('click', handleLogout);

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = togglePassword.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });
}

// SERIE I: Handle Login (Authentication)
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Show loading state
    setLoginLoading(true);
    hideError();

    try {
        const response = await fetch(API_CONFIG.loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: username,
                Password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Save token and user
            authToken = data.token;
            currentUser = username;

            // Store in localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', currentUser);

            // Show chat screen
            showChatScreen();
        } else {
            showError(data.message || 'Credenciales incorrectas. Por favor, intente nuevamente.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Error al conectar con el servidor. Por favor, intente más tarde.');
    } finally {
        setLoginLoading(false);
    }
}

// SERIE II: Handle Send Message
async function handleSendMessage(e) {
    e.preventDefault();

    const messageContent = messageInput.value.trim();
    if (!messageContent) return;

    // Disable send button
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;

    try {
        const response = await fetch(API_CONFIG.messagesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                Cod_Sala: 0,
                Login_Emisor: currentUser,
                Contenido: messageContent
            })
        });

        if (response.ok) {
            // Clear input
            messageInput.value = '';

            // Reload messages
            await loadMessages();

            // Scroll to bottom
            scrollToBottom();
        } else {
            const errorData = await response.json();
            alert('Error al enviar mensaje: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Send message error:', error);
        alert('Error al enviar mensaje. Por favor, intente nuevamente.');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// SERIE III: Load Messages from Database
async function loadMessages() {
    try {
        const response = await fetch(API_CONFIG.getMessagesUrl);

        if (response.ok) {
            const messages = await response.json();
            displayMessages(messages);
        } else {
            showEmptyState('Error al cargar mensajes');
        }
    } catch (error) {
        console.error('Load messages error:', error);
        showEmptyState('No se pudo conectar con el servidor de mensajes');
    }
}

// Display Messages
function displayMessages(messages) {
    if (!messages || messages.length === 0) {
        showEmptyState('No hay mensajes aún. ¡Sé el primero en escribir!');
        return;
    }

    messagesArea.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        const isOwnMessage = message.Login_Emisor === currentUser;

        messageDiv.className = `message ${isOwnMessage ? 'own' : 'other'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <strong>${message.Login_Emisor}</strong>
                </div>
                <div class="message-content">
                    ${escapeHtml(message.Contenido)}
                </div>
                <div class="message-time">
                    ${formatDate(message.Fecha_Envio)}
                </div>
            </div>
        `;

        messagesArea.appendChild(messageDiv);
    });

    scrollToBottom();
}

// Show Empty State
function showEmptyState(message) {
    messagesArea.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-chat-text"></i>
            <p>${message}</p>
        </div>
    `;
}

// Show Chat Screen
function showChatScreen() {
    loginScreen.classList.add('d-none');
    chatScreen.classList.remove('d-none');
    currentUserSpan.textContent = currentUser;

    // Load messages
    loadMessages();

    // Start polling for new messages (every 3 seconds)
    messagesPollInterval = setInterval(loadMessages, 3000);

    // Focus on message input
    messageInput.focus();
}

// Handle Logout
function handleLogout() {
    // Clear session
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;

    // Stop polling
    if (messagesPollInterval) {
        clearInterval(messagesPollInterval);
        messagesPollInterval = null;
    }

    // Show login screen
    chatScreen.classList.add('d-none');
    loginScreen.classList.remove('d-none');

    // Reset form
    loginForm.reset();
}

// UI Helper Functions
function setLoginLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtnText.classList.toggle('d-none', isLoading);
    loginSpinner.classList.toggle('d-none', !isLoading);
}

function showError(message) {
    loginErrorMsg.textContent = message;
    loginError.classList.remove('d-none');
}

function hideError() {
    loginError.classList.add('d-none');
}

function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // Si es de hoy
    if (diff < 86400000 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('es-GT', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Si es de ayer
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
        return 'Ayer ' + date.toLocaleTimeString('es-GT', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Fecha completa
    return date.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
