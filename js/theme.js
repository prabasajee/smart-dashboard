/**
 * Theme management for Smart Dashboard
 * Handles dark/light theme toggle and persistence
 * Developer 2 (Your Friend) - Theme Toggle Functionality
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = null;
        this.themeKey = 'smartDashboard_theme';
        
        this.init();
    }

    init() {
        console.log('🌙 Theme Manager initialized!');
        this.bindElements();
        this.loadSavedTheme();
        this.bindEvents();
        this.applyTheme();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.themeToggle = document.getElementById('themeToggle');
    }

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.themeKey)) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        
        console.log(`🎨 Theme changed to: ${this.currentTheme}`);
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme');
        
        // Add current theme class
        body.classList.add(`${this.currentTheme}-theme`);
        
        // Update theme toggle icon
        this.updateThemeToggleIcon();
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
    }

    /**
     * Update the theme toggle button icon
     */
    updateThemeToggleIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const color = this.currentTheme === 'light' ? '#667eea' : '#2d3748';
        metaThemeColor.content = color;
    }

    /**
     * Save current theme to localStorage
     */
    saveTheme() {
        localStorage.setItem(this.themeKey, this.currentTheme);
    }

    /**
     * Get current theme
     * @returns {string} - Current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme programmatically
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveTheme();
        }
    }

    /**
     * Reset to system theme
     */
    resetToSystemTheme() {
        localStorage.removeItem(this.themeKey);
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
        
        this.applyTheme();
        console.log('🔄 Theme reset to system preference');
    }

    /**
     * Check if dark mode is supported
     * @returns {boolean}
     */
    isDarkModeSupported() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Get system theme preference
     * @returns {string} - 'light' or 'dark'
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
