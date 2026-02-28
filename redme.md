# 🌦 Weather Dashboard Application

A modern, responsive Weather Forecast Web Application built using **HTML, Tailwind CSS, and Vanilla JavaScript (ES6 Modules)**.

This application integrates with the **OpenWeatherMap API** to provide real-time weather data, 5-day forecasts, dynamic backgrounds, and interactive UI features.

---

## 🔥 Project Highlights

-  Search weather by city name
-  Detect weather using current location
-  Toggle temperature (°C/°F) only on today data 
-  5-day forecast display
-  Recently searched cities (localStorage)
-  Dynamic weather background video
-  Custom animated alert system (No `alert()`)
-  Fully responsive (Desktop, iPad Mini, iPhone SE)

---

# 🏗 Architecture Overview
```
    User Interaction
           ↓
    Event Listeners
           ↓
    Geocoding API (City → Coordinates)
           ↓
    Weather API (Lat, Lon → Weather Data)
           ↓
    State Update
           ↓
    Dynamic UI Rendering
           ↓
    Background + Alerts + Forecast Cards
```



---

# 🎨 UI Features

## 🌡 Temperature Toggle
- Smooth animated toggle switch
- Converts °C ↔ °F
- Only affects today’s temperature

## 🎥 Dynamic Weather Background
daynamicaly change backgrond according to weather conditions :
- Clear
- Clouds
- Rain
- Snow
- Thunderstorm

## 🔥 Custom Weather Alerts
- Temperature > 30°C → Heat alert
- Temperature < 10°C → Cold alert

##  Recent City Dropdown
- Stored in localStorage
- Maximum 5 entries
- Duplicate removal
- Click to re-search

## Error Handling and Validation

- Validate user inputs to prevent errors by custom popup alert
- No default JavaScript alert is used.

---

# 📱 Responsive Design

Built using Tailwind CSS utility classes.

Tested for:
- Desktop
- iPad Mini
- iPhone SE

Features:
- Flexible grid layout
- Adaptive forecast cards
- Scalable typography
- Mobile-friendly controls

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| HTML5 | Structure |
| Tailwind CSS | Styling & Responsiveness |
| JavaScript (ES6) | Logic & API Integration |
| OpenWeatherMap API | Weather Data |
| Geolocation API | Current Location |
| LocalStorage | Save recent cities |
|CDN(Remixicon)|for icons|
---

# 📂 Project Structure
```
     weatherApp/
     │
     ├── index.html
     ├── weather.js
     ├── api.js
     ├── output.css
     ├── dist/
     │ ├── clear.mp4
     │ ├── clouds.mp4
     │ ├── rain.mp4
     │ ├── snow.mp4
     │ ├── thunder.mp4
     │ └── defaultWind.mp4
     └── README.md  
```

---


# ⚙ Setup Instructions

1️⃣ Clone Repository

```bash
git clone "https://github.com/shibsankarBera/weatherApp.git"
cd weatherApp
``` 

2️⃣ Add API Key
Inside api.js:
```js
export const API_key = "YOUR_OPENWEATHER_API_KEY";
```

3️⃣ Run Tailwind (If Using CLI)
```bash
npm install
npx tailwindcss -i ./src/input.css -o ./output.css --watch
```
4️⃣ Run Project
  ```
  open index.html
  run live server
  ```
---