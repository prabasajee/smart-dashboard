/**
 * Main JavaScript file for Smart Dashboard
 * Handles clock functionality and app initialization
 * Developer 1 (You) - Core Functionality
 */

class SmartDashboard {
    constructor() {
        this.clockInterval = null;
        this.init();
    }

    init() {
        console.log('🌟 Smart Dashboard initialized!');
        this.startClock();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM Content Loaded');
        });
    }

    /**
     * Start the live clock functionality
     * Updates every second with current time and date
     */
    startClock() {
        this.updateClock();
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    /**
     * Update the clock display with current time and date
     */
    updateClock() {
        const now = new Date();
        
        // Format time
        const timeString = this.formatTime(now);
        const period = now.getHours() >= 12 ? 'PM' : 'AM';
        
        // Format date
        const dateString = this.formatDate(now);
        const dayString = this.formatDay(now);
        
        // Update DOM elements
        const timeDisplay = document.getElementById('timeDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        
        if (timeDisplay) {
            const timeElement = timeDisplay.querySelector('.time');
            const periodElement = timeDisplay.querySelector('.period');
            
            if (timeElement) timeElement.textContent = timeString;
            if (periodElement) periodElement.textContent = period;
        }
        
        if (dateDisplay) {
            const dateElement = dateDisplay.querySelector('.date');
            const dayElement = dateDisplay.querySelector('.day');
            
            if (dateElement) dateElement.textContent = dateString;
            if (dayElement) dayElement.textContent = dayString;
        }
    }

    /**
     * Format time in 12-hour format
     * @param {Date} date - Date object to format
     * @returns {string} - Formatted time string
     */
    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Format date in readable format
     * @param {Date} date - Date object to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Format day of the week
     * @param {Date} date - Date object to format
     * @returns {string} - Day of the week
     */
    formatDay(date) {
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Get timezone information (optional feature)
     * @returns {string} - Current timezone
     */
    getTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    /**
     * Stop the clock (cleanup method)
     */
    stopClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    }
}

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smartDashboard = new SmartDashboard();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartDashboard;
}
