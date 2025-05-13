import '../../../modules/chat.js';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize student dashboard components
  const timelineItems = document.querySelectorAll('.timeline-item');
  const submissionCards = document.querySelectorAll('.submission-card');
  
  // Add student dashboard specific logic here
});

// Dynamic Task Management
function addTask(task) {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;
  const li = document.createElement('li');
  li.className = 'task-item';
  li.innerHTML = `<span>${task.title}</span> <span class="status ${task.status}">${task.status}</span>`;
  taskList.appendChild(li);
}

// File Upload Handler
function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  
  // File validation
  const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    uploadStatus.textContent = 'Invalid file type. Allowed: PDF, DOCX, PNG, JPG';
    uploadStatus.className = 'status error';
    return;
  }
  if (file.size > maxSize) {
    uploadStatus.textContent = 'File size exceeds 5MB limit';
    uploadStatus.className = 'status error';
    return;
  }
  // Simulate upload and approval status
  const uploadStatus = document.getElementById('uploadStatus');
  if (uploadStatus) {
    uploadStatus.textContent = `Uploading: ${file.name}...`;
    setTimeout(() => {
      uploadStatus.textContent = `Awaiting Approval: ${file.name}`;
      uploadStatus.className = 'status pending';
    }, 1500);
  }
}


// Progress Tracking (simulate chart update)
function updateProgress(percent) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  
  // Destroy existing chart instance if exists
  if (window.progressChart) {
    window.progressChart.destroy();
  }
  
  window.progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        label: 'Project Progress',
        data: [percent, 100 - percent],
        backgroundColor: ['#4CAF50', '#e0e0e0'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Deadline Alerts
function checkDeadlines() {
  const deadlines = document.querySelectorAll('.deadline-item');
  deadlines.forEach(item => {
    if (item.classList.contains('urgent')) {
      showNotification('Upcoming Deadline', 'You have an urgent deadline soon!');
    }
  });
}

// Notification Integration
function showNotification(title, message) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }
}

import '../../../modules/chat.js';

document.addEventListener('DOMContentLoaded', function() {
  // Task Management Example
  addTask({ title: 'Submit Literature Review', status: 'pending' });
  // File Upload
  const uploadInput = document.getElementById('fileUploadInput');
  if (uploadInput) {
    uploadInput.addEventListener('change', function() { handleFileUpload(this); });
  }
  // Messaging
  // Initialize real-time chat module
  if (typeof chatModule !== 'undefined') {
    chatModule.init();
  } else {
    console.error('Chat module not loaded');
  }
  // Progress Tracking Example
  updateProgress(70);
  // Deadline Alerts
  checkDeadlines();
});