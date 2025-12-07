# 🌡️ IoT Device Dashboard

A professional, production-ready IoT dashboard for real-time temperature, humidity, and device status monitoring with live data visualization.

![IoT Dashboard](https://img.shields.io/badge/IoT-Dashboard-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-orange)

## 🚀 Live Demo

**View the live dashboard:** [https://yourusername.github.io/iot-dashboard](https://yourusername.github.io/iot-dashboard)

> Replace `yourusername` with your GitHub username after deployment.

## ✨ Features

- **Real-Time Data**: Fetches live data from multiple APIs (OpenWeatherMap, Air Quality API, NASA API)
- **Smart Fallbacks**: Automatically falls back to simulated data if APIs are unavailable
- **Live Chart Visualization**: Real-time temperature trends using Chart.js
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **PWA Ready**: Installable as a Progressive Web App
- **Auto-Refresh**: Updates data every 5 seconds automatically
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Visual feedback during data fetching
- **API Status Indicator**: Shows whether live or simulated data is being used

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with SEO optimization
- **CSS3**: Modern styling with glassmorphism effects and animations
- **JavaScript (ES6+)**: Vanilla JavaScript with async/await
- **Chart.js**: Beautiful, responsive charts for data visualization
- **PWA**: Service Worker and Web App Manifest for offline support
- **GitHub Pages**: Free hosting for static sites

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](screenshots/desktop.png)

### Mobile View
![Mobile Dashboard](screenshots/mobile.png)

> Add your screenshots to the `screenshots/` folder

## 🚀 Quick Start

## 🔧 Configuration

### Using Real API Data

The dashboard automatically tries to fetch real data from:

1. **OpenWeatherMap API** (Primary)
   - Get a free API key from [openweathermap.org](https://openweathermap.org/api)
   - Update `app.js` line 18: `key: 'YOUR_API_KEY'`
   - Change city: `city: 'YourCity'`

2. **Air Quality API** (Backup)
   - Public API, no key required
   - Automatically used as fallback

3. **NASA API** (Fallback)
   - Free API with DEMO_KEY
   - Used if other APIs fail

4. **Simulated Data** (Final Fallback)
   - Uses `data.json` with randomized values
   - Always works, even offline

### Customization

- **Update refresh interval**: Change `refreshInterval` in `app.js` (line 6)
- **Adjust thresholds**: Modify `temperatureThresholds` and `humidityThresholds` in `app.js`
- **Change city**: Update `city` in the API configuration
- **Styling**: Customize colors and styles in `style.css`

## 📁 Project Structure

```
iot-dashboard/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── app.js              # Application logic
├── data.json           # Fallback data source
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── deploy.sh          # Deployment script
├── .gitignore         # Git ignore file
├── README.md          # This file
└── deploy-instructions.md  # Detailed deployment guide
```

> **Note**: PWA icons (`icon-192.png`, `icon-512.png`) are optional. The dashboard works without them, but you can add custom icons for a better PWA experience.

## 🌐 API Sources

### Primary: OpenWeatherMap
- **URL**: `https://api.openweathermap.org/data/2.5/weather`
- **Free Tier**: 1,000 calls/day
- **Data**: Real temperature and humidity

### Backup: Air Quality API
- **URL**: `https://api.waqi.info/feed/{city}/`
- **Free Tier**: Public API
- **Data**: Air quality index and humidity

### Fallback: NASA API
- **URL**: `https://api.nasa.gov/planetary/apod`
- **Free Tier**: Unlimited with DEMO_KEY
- **Data**: Derived from API response

## 🔒 CORS & API Notes

All APIs used are CORS-enabled and work directly from the browser:
- OpenWeatherMap: Supports CORS
- Air Quality API: Public CORS-enabled endpoint
- NASA API: CORS-enabled

No backend required!

## 📱 Progressive Web App (PWA)

The dashboard is PWA-ready:
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Service Worker caches resources
- **App-like Experience**: Standalone display mode

To install:
- **Chrome/Edge**: Click the install icon in the address bar
- **Safari**: Share → Add to Home Screen
- **Firefox**: Menu → Install

## 🐛 Troubleshooting

### Dashboard shows "Connection Error"
- Check your internet connection
- APIs may be temporarily unavailable (fallback to simulated data)
- Verify API keys are correct (if using OpenWeatherMap)

### GitHub Pages not loading
- Ensure `index.html` is in the root directory
- Check repository settings → Pages is enabled
- Wait 2-5 minutes after enabling Pages

### Chart not displaying
- Check browser console for errors
- Ensure Chart.js CDN is accessible
- Try clearing browser cache

## 🙏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Air Quality API](https://aqicn.org/api/) for air quality data
- [NASA](https://api.nasa.gov/) for public API access

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [deploy-instructions.md](deploy-instructions.md) for detailed setup

---

**Made with ❤️ for the IoT community**

⭐ Star this repo if you find it useful!
