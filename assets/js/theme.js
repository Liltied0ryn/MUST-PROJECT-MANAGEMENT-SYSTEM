class ThemeManager {
  constructor() {
    this.toggleBtn = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    // 1. Check for saved preference
    const savedTheme = localStorage.getItem('must-theme');
    
    // 2. Detect system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 3. Apply appropriate theme
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
    
    // 4. Set up toggle button
    this.toggleBtn?.addEventListener('click', () => this.toggleTheme());
    this.updateToggleIcon();
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('must-theme', newTheme);
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    if (!this.toggleBtn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => new ThemeManager());