// Shared state for all dashboards
const dashboardState = {
    currentUser: null,
    notifications: [],
    theme: 'light'
};

// Initialize dashboard
function initDashboard(userType) {
    // Set current user based on type
    dashboardState.currentUser = {
        type: userType,
        name: userType === 'student' ? 'John Doe' : 
              userType === 'supervisor' ? 'Dr. Smith' : 
              'Coordinator Admin',
        id: userType === 'student' ? 'ST2023001' : 
            userType === 'supervisor' ? 'SUP2023001' : 
            'COORD2023'
    };

    // Load notifications
    loadNotifications();
    
    // Initialize theme
    initTheme();
    
    // Initialize role-specific functionality
    if (userType === 'student') initStudentDashboard();
    else if (userType === 'supervisor') initSupervisorDashboard();
    else if (userType === 'coordinator') initCoordinatorDashboard();
    
    // Setup event listeners
    setupEventListeners();
}

// Notification system
function loadNotifications() {
    // Simulated notifications
    dashboardState.notifications = [
        { id: 1, title: 'New message from supervisor', type: 'message', read: false, timestamp: new Date() },
        { id: 2, title: 'Document approved', type: 'approval', read: false, timestamp: new Date(Date.now() - 3600000) },
        { id: 3, title: 'Meeting scheduled', type: 'calendar', read: true, timestamp: new Date(Date.now() - 86400000) }
    ];
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const unreadCount = dashboardState.notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('mustTheme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    dashboardState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mustTheme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// Event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = dashboardState.theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    // Notification dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationDropdown);
    }
    
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', toggleProfileDropdown);
    }
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Mark notifications as read when dropdown is opened
        if (dropdown.classList.contains('show')) {
            dashboardState.notifications.forEach(n => n.read = true);
            updateNotificationBadge();
            renderNotifications();
        }
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

function renderNotifications() {
    const container = document.getElementById('notificationDropdown');
    if (container) {
        container.innerHTML = dashboardState.notifications
            .map(notification => `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                    <div class="notification-icon">
                        <i class="fas fa-${notification.type === 'message' ? 'envelope' : 
                                          notification.type === 'approval' ? 'check-circle' : 
                                          'calendar'}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-time">${formatTime(notification.timestamp)}</div>
                    </div>
                </div>
            `).join('');
    }
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Student Dashboard Functions
function initStudentDashboard() {
    // Initialize student-specific functionality
    setupStudentProgress();
    setupStudentChat();
    setupStudentTasks();
    
    // Load student data
    loadStudentData();
}

function loadStudentData() {
    // Simulated API call
    setTimeout(() => {
        // Update progress rings
        const progressValue = document.querySelector('.progress-value');
        if (progressValue) progressValue.textContent = '70%';
        
        const circle = document.querySelector('.progress-ring__circle');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (70 / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
        
        // Update progress bars
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }, 500);
}

function setupStudentProgress() {
    // Click event for timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.querySelector('.status');
            if (status) {
                alert(`Status details: ${status.textContent.trim()}`);
            }
        });
    });
}

function setupStudentChat() {
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.chat-input .btn');
    
    if (chatInput && sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function sendMessage() {
    const input = document.querySelector('.chat-input input');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (input.value.trim() && messagesContainer) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-content">${input.value}</div>
            <div class="message-time">Just now</div>
        `;
        messagesContainer.appendChild(messageDiv);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate supervisor reply
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message received';
            replyDiv.innerHTML = `
                <div class="message-sender">Dr. Smith</div>
                <div class="message-content">Thanks for your message. I'll review it and get back to you soon.</div>
                <div class="message-time">Just now</div>
            `;
            messagesContainer.appendChild(replyDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);
    }
}

function setupStudentTasks() {
    // Task completion
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (taskItem) {
                if (this.checked) {
                    taskItem.classList.add('completed');
                    setTimeout(() => {
                        taskItem.style.opacity = '0.5';
                    }, 300);
                } else {
                    taskItem.classList.remove('completed');
                    taskItem.style.opacity = '1';
                }
            }
        });
    });
}

// Supervisor Dashboard Functions
function initSupervisorDashboard() {
    setupSupervisorStudents();
    setupSupervisorTasks();
    setupDocumentApproval();
}

function setupSupervisorStudents() {
    // Student progress interaction
    document.querySelectorAll('.student-card').forEach(card => {
        card.addEventListener('click', function() {
            const studentName = this.querySelector('.student-name').textContent;
            alert(`Viewing details for ${studentName}. This would open a detailed student profile.`);
        });
    });
}

function setupSupervisorTasks() {
    // Task management
    document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('task-checkbox') && !e.target.closest('.task-actions')) {
                const taskTitle = this.querySelector('.task-title').textContent;
                alert(`Task details: ${taskTitle}`);
            }
        });
    });
    
    // Task action buttons
    document.querySelectorAll('.task-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-comment')) {
                alert('Open chat with student about this task');
            } else if (icon.classList.contains('fa-calendar-plus')) {
                alert('Schedule meeting about this task');
            }
        });
    });
}

function setupDocumentApproval() {
    // Document approval buttons
    document.querySelectorAll('.document-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const documentItem = this.closest('.document-item');
            const action = this.classList.contains('btn-approve') ? 'approved' : 
                          this.classList.contains('btn-reject') ? 'rejected' : 
                          'marked for review';
            const docTitle = documentItem.querySelector('.document-title').textContent;
            
            alert(`Document "${docTitle}" has been ${action}.`);
            
            documentItem.style.opacity = '0.5';
            setTimeout(() => {
                documentItem.remove();
            }, 500);
        });
    });
}

// Coordinator Dashboard Functions
function initCoordinatorDashboard() {
    setupProjectAssignment();
    setupCalendar();
    setupSupervisorManagement();
}

function setupProjectAssignment() {
    // Project assignment logic
    const assignBtn = document.getElementById('assignBtn');
    const unassignBtn = document.getElementById('unassignBtn');
    
    if (assignBtn && unassignBtn) {
        assignBtn.addEventListener('click', function() {
            const selectedProject = document.querySelector('.project-item.selected');
            const selectedStudent = document.querySelector('.student-item.selected');
            
            if (selectedProject && selectedStudent) {
                const projectName = selectedProject.querySelector('.project-title').textContent;
                const studentName = selectedStudent.querySelector('.student-name').textContent;
                alert(`Assigned ${studentName} to project: ${projectName}`);
            } else {
                alert('Please select both a project and a student');
            }
        });
        
        unassignBtn.addEventListener('click', function() {
            const selectedStudent = document.querySelector('.student-item.selected');
            if (selectedStudent) {
                const studentName = selectedStudent.querySelector('.student-name').textContent;
                alert(`Unassigned ${studentName} from their current project`);
            } else {
                alert('Please select a student to unassign');
            }
        });
    }
}

function setupCalendar() {
    // Calendar event clicks
    document.querySelectorAll('.calendar-day.event').forEach(day => {
        day.addEventListener('click', function() {
            const date = this.textContent;
            const eventType = this.classList.contains('presentation') ? 'Presentation' : 'Defense';
            alert(`${eventType} scheduled for June ${date}. Click to view details.`);
        });
    });
}

function setupSupervisorManagement() {
    // Supervisor card interactions
    document.querySelectorAll('.supervisor-card').forEach(card => {
        card.addEventListener('click', function() {
            const supervisorName = this.querySelector('.supervisor-name').textContent;
            alert(`Viewing details for ${supervisorName}. This would open supervisor management.`);
        });
    });
}

// Export functions needed in HTML files
window.dashboard = {
    initDashboard,
    setTheme,
    loadNotifications,
    updateNotificationBadge
};