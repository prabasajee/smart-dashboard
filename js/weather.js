/**
 * Weather module for Smart Dashboard
 * Handles weather API integration and display
 * Developer 1 (You) - Weather API Integration
 */

class WeatherManager {
    constructor() {
        // TODO: Replace with your actual OpenWeatherMap API key
        this.apiKey = 'YOUR_API_KEY_HERE';
        this.apiUrl = 'https://api.openweathermap.org/data/2.5';
        this.currentWeather = null;
        this.userLocation = null;
        
        this.init();
    }

    init() {
        console.log('🌤️ Weather Manager initialized!');
        this.getLocationAndWeather();
    }

    /**
     * Get user's location and fetch weather data
     */
    async getLocationAndWeather() {
        try {
            // Check if geolocation is available
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        };
                        this.fetchWeatherData();
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        this.handleLocationError();
                    }
                );
            } else {
                console.error('Geolocation not supported');
                this.handleLocationError();
            }
        } catch (error) {
            console.error('Error getting location:', error);
            this.handleLocationError();
        }
    }

    /**
     * Handle location error by using default city
     */
    handleLocationError() {
        console.log('Using default location: New York');
        this.fetchWeatherByCity('New York');
    }

    /**
     * Fetch weather data using coordinates
     */
    async fetchWeatherData() {
        if (!this.userLocation) {
            console.error('No location available');
            return;
        }

        try {
            const url = `${this.apiUrl}/weather?lat=${this.userLocation.lat}&lon=${this.userLocation.lon}&appid=${this.apiKey}&units=metric`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentWeather = data;
            this.displayWeather(data);
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.displayWeatherError();
        }
    }

    /**
     * Fetch weather data by city name
     * @param {string} city - City name
     */
    async fetchWeatherByCity(city) {
        try {
            const url = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentWeather = data;
            this.displayWeather(data);
            
        } catch (error) {
            console.error('Error fetching weather by city:', error);
            this.displayWeatherError();
        }
    }

    /**
     * Display weather information in the dashboard
     * @param {Object} weatherData - Weather data from API
     */
    displayWeather(weatherData) {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo) return;

        const temperature = Math.round(weatherData.main.temp);
        const condition = weatherData.weather[0].description;
        const location = weatherData.name;
        const icon = weatherData.weather[0].icon;

        // Update weather icon
        const weatherIcon = weatherInfo.querySelector('.weather-icon i');
        if (weatherIcon) {
            weatherIcon.className = this.getWeatherIcon(weatherData.weather[0].main);
        }

        // Update weather details
        const temperatureElement = weatherInfo.querySelector('.temperature');
        const conditionElement = weatherInfo.querySelector('.condition');
        const locationElement = weatherInfo.querySelector('.location');

        if (temperatureElement) temperatureElement.textContent = `${temperature}°C`;
        if (conditionElement) conditionElement.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
        if (locationElement) locationElement.textContent = location;

        console.log('✅ Weather data displayed successfully');
    }

    /**
     * Display weather error message
     */
    displayWeatherError() {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo) return;

        const temperatureElement = weatherInfo.querySelector('.temperature');
        const conditionElement = weatherInfo.querySelector('.condition');
        const locationElement = weatherInfo.querySelector('.location');

        if (temperatureElement) temperatureElement.textContent = '--°C';
        if (conditionElement) conditionElement.textContent = 'Unable to load weather';
        if (locationElement) locationElement.textContent = 'Check API key';

        console.log('❌ Weather error displayed');
    }

    /**
     * Get appropriate Font Awesome icon for weather condition
     * @param {string} condition - Weather condition from API
     * @returns {string} - Font Awesome icon class
     */
    getWeatherIcon(condition) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-rain',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Haze': 'fas fa-smog',
            'Smoke': 'fas fa-smog'
        };

        return iconMap[condition] || 'fas fa-cloud';
    }

    /**
     * Refresh weather data
     */
    refreshWeather() {
        console.log('🔄 Refreshing weather data...');
        if (this.userLocation) {
            this.fetchWeatherData();
        } else {
            this.getLocationAndWeather();
        }
    }

    /**
     * Get weather forecast (future enhancement)
     */
    async getForecast() {
        // TODO: Implement 5-day forecast
        console.log('📊 Forecast feature coming soon...');
    }
}

// Initialize weather manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.weatherManager = new WeatherManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherManager;
}
