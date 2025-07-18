/**
 * Quotes module for Smart Dashboard
 * Handles inspirational quote fetching and display
 * Developer 2 (Your Friend) - Quotes API Integration
 */

class QuotesManager {
    constructor() {
        this.apiUrl = 'https://api.quotable.io/random';
        this.currentQuote = null;
        this.quoteContainer = null;
        this.refreshButton = null;
        
        this.init();
    }

    init() {
        console.log('💭 Quotes Manager initialized!');
        this.bindElements();
        this.bindEvents();
        this.loadDailyQuote();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.quoteContainer = document.getElementById('quoteContainer');
        this.refreshButton = document.getElementById('refreshQuote');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => this.getNewQuote());
        }
    }

    /**
     * Load daily quote (checks if we need a new one)
     */
    loadDailyQuote() {
        const today = new Date().toDateString();
        const savedQuote = localStorage.getItem('smartDashboard_quote');
        const savedDate = localStorage.getItem('smartDashboard_quoteDate');

        if (savedQuote && savedDate === today) {
            // Show cached quote for today
            this.currentQuote = JSON.parse(savedQuote);
            this.displayQuote(this.currentQuote);
        } else {
            // Get new quote for today
            this.getNewQuote();
        }
    }

    /**
     * Fetch a new quote from the API
     */
    async getNewQuote() {
        try {
            this.showLoading();
            
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentQuote = data;
            
            // Save quote for today
            this.saveQuoteForToday(data);
            
            this.displayQuote(data);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            this.displayFallbackQuote();
        }
    }

    /**
     * Save quote for today in localStorage
     * @param {Object} quote - Quote data
     */
    saveQuoteForToday(quote) {
        const today = new Date().toDateString();
        localStorage.setItem('smartDashboard_quote', JSON.stringify(quote));
        localStorage.setItem('smartDashboard_quoteDate', today);
    }

    /**
     * Display quote in the dashboard
     * @param {Object} quote - Quote data
     */
    displayQuote(quote) {
        if (!this.quoteContainer) return;

        const quoteText = this.quoteContainer.querySelector('.quote-text');
        const quoteAuthor = this.quoteContainer.querySelector('.quote-author');

        if (quoteText && quoteAuthor) {
            quoteText.textContent = `"${quote.content}"`;
            quoteAuthor.textContent = `— ${quote.author}`;
            
            // Add animation
            this.animateQuoteChange();
        }

        this.hideLoading();
        console.log('✅ Quote displayed:', quote.content);
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (!this.quoteContainer) return;

        const quoteText = this.quoteContainer.querySelector('.quote-text');
        const quoteAuthor = this.quoteContainer.querySelector('.quote-author');

        if (quoteText && quoteAuthor) {
            quoteText.textContent = 'Loading inspirational quote...';
            quoteAuthor.textContent = '— Please wait';
        }

        if (this.refreshButton) {
            this.refreshButton.disabled = true;
            const icon = this.refreshButton.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
            }
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.refreshButton) {
            this.refreshButton.disabled = false;
            const icon = this.refreshButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-spin');
            }
        }
    }

    /**
     * Animate quote change
     */
    animateQuoteChange() {
        if (!this.quoteContainer) return;

        this.quoteContainer.style.opacity = '0';
        this.quoteContainer.style.transform = 'translateY(20px)';

        setTimeout(() => {
            this.quoteContainer.style.opacity = '1';
            this.quoteContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Display fallback quote when API fails
     */
    displayFallbackQuote() {
        const fallbackQuotes = [
            {
                content: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            },
            {
                content: "Innovation distinguishes between a leader and a follower.",
                author: "Steve Jobs"
            },
            {
                content: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt"
            },
            {
                content: "It is during our darkest moments that we must focus to see the light.",
                author: "Aristotle"
            },
            {
                content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill"
            }
        ];

        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        this.displayQuote(randomQuote);
        this.hideLoading();
    }

    /**
     * Get quote by category (future enhancement)
     * @param {string} category - Quote category
     */
    async getQuoteByCategory(category) {
        try {
            const url = `${this.apiUrl}?tags=${category}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.displayQuote(data);
            
        } catch (error) {
            console.error('Error fetching quote by category:', error);
            this.displayFallbackQuote();
        }
    }

    /**
     * Get available quote categories
     */
    async getCategories() {
        try {
            const response = await fetch('https://api.quotable.io/tags');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    /**
     * Share current quote
     */
    shareQuote() {
        if (!this.currentQuote) return;

        const shareText = `"${this.currentQuote.content}" — ${this.currentQuote.author}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Inspirational Quote',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                console.log('Quote copied to clipboard!');
                // TODO: Show toast notification
            });
        }
    }

    /**
     * Get quote history (future enhancement)
     */
    getQuoteHistory() {
        const history = localStorage.getItem('smartDashboard_quoteHistory');
        return history ? JSON.parse(history) : [];
    }

    /**
     * Add quote to history (future enhancement)
     * @param {Object} quote - Quote data
     */
    addToHistory(quote) {
        const history = this.getQuoteHistory();
        history.unshift(quote);
        
        // Keep only last 10 quotes
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem('smartDashboard_quoteHistory', JSON.stringify(history));
    }
}

// Initialize quotes manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quotesManager = new QuotesManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuotesManager;
}
