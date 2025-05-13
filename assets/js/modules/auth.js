// Authentication module
const authModule = {
  // Handle login form submission
  handleLogin: function(e) {
    e.preventDefault();
    
    // Add animation to button
    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) submitButton.classList.add('submitting');
    
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;
    const role = document.querySelector('#loginForm select').value;
    
    // Validate inputs
    if (!email || !password || !role) {
      this.showError('Please fill in all fields');
      return;
    }
    
    // Mock authentication (will be replaced with real API call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirect to appropriate dashboard
      window.location.href = `../../pages/dashboards/${role}/index.html`;
    } else {
      this.showError('Invalid credentials');
    }
  },
  
  // Handle registration form submission
  handleRegister: function(e) {
    e.preventDefault();
    
    // Get all form values
    const formData = {
      name: document.querySelector('#registerForm input[placeholder="Full Name"]').value,
      regNo: document.querySelector('#registerForm input[placeholder="Registration Number"]').value,
      role: document.querySelector('#registerForm select').value,
      university: document.querySelector('#registerForm input[placeholder="University"]').value,
      college: document.querySelector('#registerForm input[placeholder="College"]').value,
      department: document.querySelector('#registerForm input[placeholder="Department"]').value,
      course: document.querySelector('#registerForm input[placeholder="Course"]').value,
      year: document.querySelector('#registerForm input[placeholder="Year"]').value,
      email: '', // Will be added later
      password: document.querySelector('#registerForm #password').value,
      profilePic: document.querySelector('#profilePreview').src || ''
    };
    
    // Validate password strength
    if (!this.validatePassword(formData.password)) {
      this.showError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      return;
    }
    
    // Generate mock email
    formData.email = `${formData.name.replace(/\s+/g, '.').toLowerCase()}@must.edu.mw`;
    
    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(formData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirect to login
    window.location.href = '../auth/login.html';
  },
  
  // Validate password strength
  validatePassword: function(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  },
  
  // Calculate password strength for meter
  calculatePasswordStrength: function(password) {
    if (!password) {
      return { percentage: 0, label: 'Weak' };
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 10; // lowercase
    if (/[A-Z]/.test(password)) score += 15; // uppercase
    if (/[0-9]/.test(password)) score += 15; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 20; // special chars
    
    // Variety check
    const variety = (password.match(/[a-z]/) ? 1 : 0) +
                   (password.match(/[A-Z]/) ? 1 : 0) +
                   (password.match(/[0-9]/) ? 1 : 0) +
                   (password.match(/[^a-zA-Z0-9]/) ? 1 : 0);
    score += variety * 5;
    
    // Cap at 100
    score = Math.min(score, 100);
    
    // Determine label
    let label = 'Weak';
    if (score >= 40 && score < 70) label = 'Medium';
    if (score >= 70) label = 'Strong';
    
    return {
      percentage: score,
      label: label
    };
  },
  
  // Show error message
  showError: function(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const form = document.querySelector('form');
    form.insertBefore(errorElement, form.firstChild);
    
    setTimeout(() => {
      errorElement.classList.add('fade-out');
      setTimeout(() => errorElement.remove(), 300);
    }, 3000);
  },
  
  // Initialize auth module
  init: function() {
    if (document.querySelector('#loginForm')) {
      document.querySelector('#loginForm').addEventListener('submit', this.handleLogin.bind(this));
    }
    
    if (document.querySelector('#registerForm')) {
      document.querySelector('#registerForm').addEventListener('submit', this.handleRegister.bind(this));
      
      // Initialize profile picture preview
      const profileUpload = document.getElementById('profileUpload');
      const profilePreview = document.getElementById('profilePreview');
      
      if (profileUpload && profilePreview) {
        profileUpload.addEventListener('change', function() {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              profilePreview.src = e.target.result;
              // Add animation class
              profilePreview.classList.add('preview-loaded');
              setTimeout(() => {
                profilePreview.classList.remove('preview-loaded');
              }, 500);
            }
            reader.readAsDataURL(file);
          }
        });
      }
      
      // Initialize password strength meter
      const passwordInput = document.getElementById('password');
      const strengthMeter = document.querySelector('.strength-meter');
      const strengthText = document.querySelector('.strength-text');
      
      if (passwordInput && strengthMeter && strengthText) {
        passwordInput.addEventListener('input', () => {
          const password = passwordInput.value;
          const strength = this.calculatePasswordStrength(password);
          
          // Update the strength meter
          strengthMeter.style.setProperty('--strength-width', `${strength.percentage}%`);
          
          // Update the strength text
          strengthText.textContent = strength.label;
          
          // Update colors based on strength
          let strengthColor;
          if (strength.percentage < 40) {
            strengthColor = 'var(--auth-error)';
          } else if (strength.percentage < 70) {
            strengthColor = 'var(--auth-warning)';
          } else {
            strengthColor = 'var(--auth-accent)';
          }
          
          // Apply the color to the meter and text
          strengthMeter.style.setProperty('--strength-color', strengthColor);
          strengthText.style.color = strengthColor;
        });
      }
      
      // Profile picture upload preview
      document.querySelector('#profileUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            document.querySelector('#profilePreview').src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
      
      // Password strength meter
      document.querySelector('#password').addEventListener('input', function(e) {
        const password = e.target.value;
        const strengthMeter = document.querySelector('.strength-meter');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];
        
        strengthMeter.style.width = `${(strength / 4) * 100}%`;
        strengthMeter.style.backgroundColor = colors[strength - 1] || '#e74c3c';
        strengthText.textContent = texts[strength - 1] || 'Weak';
      });
    }
  }
};

// Initialize auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  authModule.init();
});