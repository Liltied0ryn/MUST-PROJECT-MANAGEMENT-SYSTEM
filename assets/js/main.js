// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Theme toggle functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle button event listener
  const themeToggle = document.createElement('button');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.className = 'theme-toggle';
  themeToggle.addEventListener('click', toggleTheme);
  
  document.body.appendChild(themeToggle);
});