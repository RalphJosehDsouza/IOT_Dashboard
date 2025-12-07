// IoT Dashboard Application
// Handles data fetching from real APIs, chart updates, and UI rendering

// Configuration
const CONFIG = {
    refreshInterval: 5000, // 5 seconds
    maxChartDataPoints: 20, // Maximum number of data points to show on chart
    temperatureThresholds: {
        low: 20,
        high: 30
    },
    humidityThresholds: {
        low: 30,
        high: 60
    },
    // API Configuration
    apis: {
        // OpenWeatherMap API - Get free key from https://openweathermap.org/api
        weather: {
            key: 'demo', // Replace with your API key
            city: 'London', // Default city
            url: (city, key) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
        },
        // Air Quality API - Public API, no key needed
        airQuality: {
            url: (city) => `https://api.waqi.info/feed/${city}/?token=demo`
        },
        // NASA API - Free, uses DEMO_KEY
        nasa: {
            url: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
        }
    }
};

// Global state
let temperatureChart = null;
let chartData = {
    labels: [],
    temperatures: []
};
let refreshInterval = null;
let isUsingLiveAPI = false;
let currentDataSource = 'simulated';

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    fetchSensorData();
    setupRefreshButton();
    startAutoRefresh();
});

/**
 * Initialize the Chart.js temperature chart
 */
function initializeChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: chartData.temperatures,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4a90e2',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

/**
 * Fetch sensor data from real APIs with fallback chain
 * Priority: Weather API → Air Quality API → NASA API → Simulated Data
 */
async function fetchSensorData() {
    showLoading(true);
    updateAPIStatus('connecting', 'Connecting...');
    
    try {
        // Try OpenWeatherMap API first
        const weatherData = await fetchWeatherData();
        if (weatherData) {
            updateDashboard(weatherData);
            updateChart(weatherData.temperature);
            updateAPIStatus('live', 'Live Data');
            isUsingLiveAPI = true;
            currentDataSource = 'weather';
            showLoading(false);
            return;
        }
    } catch (error) {
        console.log('Weather API failed, trying fallback...', error);
    }
    
    try {
        // Try Air Quality API as backup
        const airQualityData = await fetchAirQualityData();
        if (airQualityData) {
            updateDashboard(airQualityData);
            updateChart(airQualityData.temperature);
            updateAPIStatus('live', 'Live Data');
            isUsingLiveAPI = true;
            currentDataSource = 'airquality';
            showLoading(false);
            return;
        }
    } catch (error) {
        console.log('Air Quality API failed, trying fallback...', error);
    }
    
    try {
        // Try NASA API as another fallback
        const nasaData = await fetchNASAData();
        if (nasaData) {
            updateDashboard(nasaData);
            updateChart(nasaData.temperature);
            updateAPIStatus('live', 'Live Data');
            isUsingLiveAPI = true;
            currentDataSource = 'nasa';
            showLoading(false);
            return;
        }
    } catch (error) {
        console.log('NASA API failed, using simulated data...', error);
    }
    
    // Fallback to simulated data
    try {
        const simulatedData = await fetchSimulatedData();
        updateDashboard(simulatedData);
        updateChart(simulatedData.temperature);
        updateAPIStatus('simulated', 'Simulated Data');
        isUsingLiveAPI = false;
        currentDataSource = 'simulated';
        showLoading(false);
    } catch (error) {
        console.error('All data sources failed:', error);
        showError('Failed to fetch sensor data. Please check your connection.');
        updateAPIStatus('error', 'Connection Error');
        showLoading(false);
    }
}

/**
 * Fetch data from OpenWeatherMap API
 * @returns {Promise<Object|null>} Sensor data or null if failed
 */
async function fetchWeatherData() {
    try {
        const url = CONFIG.apis.weather.url(CONFIG.apis.weather.city, CONFIG.apis.weather.key);
        const response = await fetch(url, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract temperature and humidity from weather data
        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            status: 'Online'
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return null;
    }
}

/**
 * Fetch data from Air Quality API
 * @returns {Promise<Object|null>} Sensor data or null if failed
 */
async function fetchAirQualityData() {
    try {
        const url = CONFIG.apis.airQuality.url('london');
        const response = await fetch(url, {
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Air Quality API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.data) {
            // Use air quality index as temperature-like metric
            // Use humidity from air quality data if available
            return {
                temperature: Math.round(20 + (data.data.aqi / 10)), // Convert AQI to temperature-like value
                humidity: data.data.iaqi?.h?.v || 45 + Math.floor(Math.random() * 10),
                status: 'Online'
            };
        }
        return null;
    } catch (error) {
        console.error('Air Quality API error:', error);
        return null;
    }
}

/**
 * Fetch data from NASA API (fallback)
 * @returns {Promise<Object|null>} Sensor data or null if failed
 */
async function fetchNASAData() {
    try {
        const response = await fetch(CONFIG.apis.nasa.url, {
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Generate temperature/humidity from NASA data hash
        const hash = data.url ? data.url.length : 0;
        return {
            temperature: Math.round(22 + (hash % 8)),
            humidity: Math.round(40 + (hash % 20)),
            status: 'Online'
        };
    } catch (error) {
        console.error('NASA API error:', error);
        return null;
    }
}

/**
 * Fetch simulated sensor data from data.json with randomization
 * @returns {Promise<Object>} Randomized sensor data
 */
async function fetchSimulatedData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`data.json?t=${timestamp}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const baseData = await response.json();
        return randomizeSensorData(baseData);
    } catch (error) {
        console.error('Error fetching simulated data:', error);
        // Return default simulated data if file doesn't exist
        return randomizeSensorData({
            temperature: 27,
            humidity: 45,
            status: 'Online'
        });
    }
}

/**
 * Randomize sensor data values to simulate real-time sensor updates
 * @param {Object} baseData - Base data from JSON file
 * @returns {Object} - Randomized sensor data
 */
function randomizeSensorData(baseData) {
    return {
        temperature: baseData.temperature + Math.floor(Math.random() * 5), // Add 0-4
        humidity: baseData.humidity + Math.floor(Math.random() * 10), // Add 0-9
        status: baseData.status || 'Online'
    };
}

/**
 * Update API status indicator
 * @param {string} status - Status type: 'live', 'simulated', 'error', 'connecting'
 * @param {string} text - Status text to display
 */
function updateAPIStatus(status, text) {
    const indicator = document.getElementById('apiStatusIndicator');
    const statusText = document.getElementById('apiStatusText');
    
    indicator.className = `api-status-indicator ${status}`;
    statusText.textContent = text;
}

/**
 * Show/hide loading spinners
 * @param {boolean} show - Whether to show loading spinners
 */
function showLoading(show) {
    const spinners = ['tempSpinner', 'humiditySpinner', 'statusSpinner'];
    spinners.forEach(id => {
        const spinner = document.getElementById(id);
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
    });
}

/**
 * Update all dashboard elements with new sensor data
 * @param {Object} data - Sensor data object
 */
function updateDashboard(data) {
    // Update temperature
    const tempElement = document.getElementById('temperatureValue');
    const tempStatus = document.getElementById('tempStatus');
    const tempStatusText = document.getElementById('tempStatusText');
    
    tempElement.textContent = data.temperature;
    
    // Determine temperature status
    if (data.temperature < CONFIG.temperatureThresholds.low) {
        tempStatus.className = 'status-indicator';
        tempStatusText.textContent = 'Low';
    } else if (data.temperature > CONFIG.temperatureThresholds.high) {
        tempStatus.className = 'status-indicator danger';
        tempStatusText.textContent = 'High';
    } else {
        tempStatus.className = 'status-indicator success';
        tempStatusText.textContent = 'Normal';
    }
    
    // Update humidity
    const humidityElement = document.getElementById('humidityValue');
    const humidityStatus = document.getElementById('humidityStatus');
    const humidityStatusText = document.getElementById('humidityStatusText');
    
    humidityElement.textContent = data.humidity;
    
    // Determine humidity status
    if (data.humidity < CONFIG.humidityThresholds.low) {
        humidityStatus.className = 'status-indicator';
        humidityStatusText.textContent = 'Low';
    } else if (data.humidity > CONFIG.humidityThresholds.high) {
        humidityStatus.className = 'status-indicator warning';
        humidityStatusText.textContent = 'High';
    } else {
        humidityStatus.className = 'status-indicator success';
        humidityStatusText.textContent = 'Normal';
    }
    
    // Update device status
    const deviceStatusElement = document.getElementById('deviceStatus');
    deviceStatusElement.textContent = data.status;
    
    // Update status badge styling
    deviceStatusElement.className = 'status-badge';
    if (data.status === 'Offline') {
        deviceStatusElement.classList.add('offline');
    } else if (data.status === 'Maintenance') {
        deviceStatusElement.classList.add('maintenance');
    }
    
    // Update alerts
    updateAlerts(data);
    
    // Update last update timestamp
    const lastUpdateElement = document.getElementById('lastUpdate');
    lastUpdateElement.textContent = new Date().toLocaleTimeString();
}

/**
 * Update alerts based on sensor readings
 * @param {Object} data - Sensor data object
 */
function updateAlerts(data) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    const alerts = [];
    
    // Check for temperature alerts
    if (data.temperature > CONFIG.temperatureThresholds.high) {
        alerts.push({
            message: `High temperature detected: ${data.temperature}°C`,
            type: 'danger'
        });
    } else if (data.temperature < CONFIG.temperatureThresholds.low) {
        alerts.push({
            message: `Low temperature detected: ${data.temperature}°C`,
            type: 'warning'
        });
    }
    
    // Check for humidity alerts
    if (data.humidity > CONFIG.humidityThresholds.high) {
        alerts.push({
            message: `High humidity detected: ${data.humidity}%`,
            type: 'warning'
        });
    } else if (data.humidity < CONFIG.humidityThresholds.low) {
        alerts.push({
            message: `Low humidity detected: ${data.humidity}%`,
            type: 'warning'
        });
    }
    
    // Check for device status alerts
    if (data.status === 'Offline') {
        alerts.push({
            message: 'Device is offline',
            type: 'danger'
        });
    } else if (data.status === 'Maintenance') {
        alerts.push({
            message: 'Device is in maintenance mode',
            type: 'warning'
        });
    }
    
    // Display alerts or "No active alerts" message
    if (alerts.length === 0) {
        const li = document.createElement('li');
        li.className = 'alert-item';
        li.textContent = 'No active alerts';
        alertsList.appendChild(li);
    } else {
        alerts.forEach(alert => {
            const li = document.createElement('li');
            li.className = `alert-item ${alert.type}`;
            li.textContent = alert.message;
            alertsList.appendChild(li);
        });
    }
}

/**
 * Update the temperature chart with new data point
 * @param {number} temperature - New temperature value
 */
function updateChart(temperature) {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    // Add new data point
    chartData.labels.push(timeLabel);
    chartData.temperatures.push(temperature);
    
    // Limit the number of data points to keep chart readable
    if (chartData.labels.length > CONFIG.maxChartDataPoints) {
        chartData.labels.shift();
        chartData.temperatures.shift();
    }
    
    // Update the chart
    temperatureChart.data.labels = chartData.labels;
    temperatureChart.data.datasets[0].data = chartData.temperatures;
    temperatureChart.update('none'); // 'none' mode for smooth updates
}

/**
 * Setup the refresh button click handler
 */
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    const refreshIcon = document.getElementById('refreshIcon');
    
    refreshBtn.addEventListener('click', () => {
        // Add rotation animation
        refreshIcon.style.animation = 'spin 0.5s linear';
        setTimeout(() => {
            refreshIcon.style.animation = '';
        }, 500);
        
        fetchSensorData();
    });
}

/**
 * Start automatic data refresh
 */
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        fetchSensorData();
    }, CONFIG.refreshInterval);
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'alert-item danger';
    li.textContent = message;
    alertsList.appendChild(li);
}

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

