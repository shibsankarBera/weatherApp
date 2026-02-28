// ============================================== SELECT ELEMENTS ==============================================================
import { API_key } from "./api.js";
const cityInput = document.getElementById("city_Input"),
  searchBtn = document.getElementById("search_Btn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = API_key,
  currentWeatherCard = document.getElementById("currentWeather"),
  forecastcontainer = document.getElementById("Forecast-container");
let inputDropdownBox = document.querySelector(".inputDropdownBox");
console.log("API KEY:", api_key);

// ==============================================    STATE/DATA  ============================================================
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let isCelsius = true;
let todayTempC = null;
let searchedPlace = {
  name: "",
  state: "",
  country: "",
};
let condition=""

// ================================================ UTILITIES & HELPER FUNCTIONS =============================================
///---------Celcious To Farenhite toogleButton-----
function toggleTodayTemp() {
  const tempVar = document.querySelector(".tempVar");
  const circle = document.getElementById("circle");
  const statusText = document.getElementById("statusText");

  if (!todayTempC) return;

  if (isCelsius) {
    const tempF = (todayTempC * 9) / 5 + 32;

    tempVar.innerHTML = `${tempF.toFixed(0)}°<sup class="text-3xl font-medium">F</sup>`;

    circle.classList.replace("left-11", "left-1");
    statusText.textContent = "°C";
    isCelsius = false;
  } else {
    tempVar.innerHTML = `${todayTempC}°<sup class="text-3xl font-medium">C</sup>`;

    circle.classList.replace("left-1", "left-11");
    statusText.textContent = "°F";
    isCelsius = true;
  }
}
//hilights focast cards
function cardHighlite(card) {
  // Remove highlight from old card
  document
    .querySelectorAll(".day-card")
    .forEach((c) => c.classList.remove("ring-4", "ring-white"));
  document.addEventListener("click", (e) => {
    if (!forecastcontainer.contains(e.target)) {
      card.classList.remove("ring-4", "ring-white");
    }
  });
  // Highlight selected card
  card.classList.add("ring-4", "ring-white");
}
//weather alert Box
function weatherAlert(temppp){
   let message=" ",bgColor=""
 const weatherAlertBox=document.createElement("div");
  if(temppp>30){
 message="its too 🔥🥵"
 bgColor="bg-red-600"
  }else if(temppp<10){
    message="its too ❄🥶"
   bgColor="bg-blue-600"
  }
weatherAlertBox.innerHTML=`${message}`
    weatherAlertBox.className=`w-40 h-10 text-2xl absolute top-14 right-6 md:right-12 lg:right-40 animate-pulse rounded-bl-3xl rounded-tr-3xl text-center  ${bgColor} `
    currentWeatherCard.appendChild(weatherAlertBox)
}

//dashboard codiotional background
function changeWeatherBackground(condition) {
  const video = document.getElementById("bgVideo");

   video.pause()
  switch (condition) {

    case "Clear":
      video.src = "/dist/clear.mp4";
      break;

    case "Clouds":
      video.src = "/dist/clouds.mp4";
      break;

    case "Rain":
      video.src = "/dist/rain.mp4";
      break;

    case "Thunderstorm":
      video.src = "/dist/thunder.mp4";
      break;

    case "Snow":
      video.src = "/dist/snow.mp4";
      break;
    default:
      video.src="/dist/defaultWind.mp4"
  }
  console.log(video);
  video.load();
  
}
//let condition="Clear"
changeWeatherBackground(condition);
console.log("condition",condition)

////Custom Error alert Box
function customAlert(message) {
  const alertBtn = document.getElementById("alertBtn");
  const alertBox = document.getElementById("alertBox");
  const alertMessage = document.getElementById("alertMessage");

  // Show alert
  alertBox.classList.remove("hidden");
  alertBox.classList.add("block");
  alertMessage.textContent = message;

  // Auto close after 4s
  const timer = setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 4000);

  // Close on button click
  alertBtn.onclick = function () {
    alertBox.classList.add("hidden");
    clearTimeout(timer); // stop auto close if user clicks
  };
}

//customAlert("Error occurred!");

// =============================================  UI FUNCTIONS ===============================================
//--------------------DASHBOARD UI UPDATE-----------------
function displayWeatherDashbord({
  tempC,
  desc,
  icon,
  wind,
  humidity,
  selectedDate,
}) {
  let date = new Date(selectedDate),
    day = "";
  const now = new Date();
  const isToday = now.getDate() === date.getDate();
  isToday ? ((date = now), (day = "ToDay")) : date;
  currentWeatherCard.innerHTML = `
          <!-- Date Row -->
          <div class="flex justify-between text-sm opacity-80 mb-6">
            <span>${date.getDate()}th${months[date.getMonth()]} ,${date.getFullYear()} </span>
            <span>${day || days[date.getDay()]}</span>
            <span>${date.getHours() % 12 || 12}:${date.getMinutes()} ${date.getHours() >= 12 ? "PM" : "AM"}</span>
          </div>

          <!-- Middle Section -->
          <div class="flex items-center justify-between">

            <!-- Left -->
            <div class="w-1/2">
              <p class="uppercase text-sm opacity-80">${desc}</p>

             <h1 class="text-5xl md:text-6xl flex flex-col justify-center items-center font-light mt-2">
               <span class="tempVar"> ${tempC}°<sup class="text-3xl font-medium">C</sup></span>
               <span class="text-lg md:text-2xl">
                  <div
                   id="toggle"
                   class="w-20 h-10 bg-gray-300 rounded-full relative border-2 border-purple-600 cursor-pointer transition duration-300"
                  >
                    <div
                    id="circle"
                    class="w-8 h-8 bg-white text-center rounded-full absolute top-1 left-11 transition-all duration-300 shadow-md"
                    >
                      <span id="statusText" class="text-gray-400 font-semibold">°F</span>
                    </div>
                  </div>
               </span>
              </h1>

              <div class="mt-4 space-y-1 text-sm">
                <p>Wind: ${wind} m/s 💨</p>
                <p>Humidity: ${humidity}% 💧</p>
              </div>
            </div>

            <!-- Right -->
            <div class="w-1/2 flex flex-col items-center">
              <div
                class="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
              >
                <img
                  class="w-full h-full object-contain drop-shadow-lg"
                  src="https://openweathermap.org/img/wn/${icon}@2x.png"
                  alt="Weather Icon"
                />
              </div>

              ${
                searchedPlace.name
                  ? `<div class="text-center mt-3">
                <p class="text-xl md:text-2xl font-semibold">${searchedPlace.name}</p>
                <p class="text-sm opacity-80"><span>${searchedPlace.state || ""}</span>,<span class="uppercase">${searchedPlace.country || ""}</span></p>
              </div>`
                  : " "
              }
            </div>
          </div>`;
 weatherAlert(tempC); ////custom weather alert
  if (isToday) {
    const toggle = document.getElementById("toggle");
    toggle.addEventListener("click", toggleTodayTemp);
  }
  changeWeatherBackground(condition);
}

//----------DYNAMIC UI 5 FORECAST CARDS-----
function displayFocastCards(fiveDayFor) {
  forecastcontainer.innerHTML = "";
  const daysToShow =
    fiveDayFor.length > 5 ? fiveDayFor.slice(0, 5) : fiveDayFor;
  console.log(daysToShow);

  daysToShow.forEach((day) => {
    const date = new Date(day.dt_txt),
      now = new Date(),
      displayDate =
        now.getDate() === date.getDate()
          ? "Today"
          : `${date.getDate()}${months[date.getMonth()]}`;
    const tempC = (day.main.temp - 273.15).toFixed(0);

    forecastcontainer.innerHTML += `
    <div class="day-card bg-white/20 flex items-center justify-around md:grid grid-cols-2 backdrop-blur-sm rounded-2xl p-4 text-white text-center hover:scale-105 transition duration-300 shadow-lg"
      data-temp="${tempC}"
      data-desc="${day.weather[0].description}"
      data-icon="${day.weather[0].icon}"
      data-wind="${day.wind.speed}"
      data-humidity="${day.main.humidity}"
      data-date="${day.dt_txt}"
      data-condition="${day.weather[0].main}">

      <p class="text-sm md:text-xl opacity-80">${daysShort[date.getDay()]}</p>
      <p class="text-sm md:text-xl opacity-80">${displayDate}</p>

      <div class="col-span-2 flex justify-center items-center">
        <img class="w-10 h-10"
          src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
      </div>

      <p class="text-sm">🌡${tempC}°c</p>
      <p class="text-xs opacity-70">💨 ${day.wind.speed} m/s</p>
    </div>`;
  });
}
//----------rendering each forcast card 1by1 to dashbord UI----------
forecastcontainer.addEventListener("click", (e) => {
  const card = e.target.closest(".day-card");
  if (!card) return;
  cardHighlite(card); //hilight cards
  // Get data from clicked card
  const tempC = card.dataset.temp;
  const desc = card.dataset.desc;
  const icon = card.dataset.icon;
  const wind = card.dataset.wind;
  const humidity = card.dataset.humidity;
  const Date = card.dataset.date;
      condition=card.dataset.condition;
 // console.log(tempC, desc, icon, wind, humidity, Date,);
  displayWeatherDashbord({
    tempC,
    desc,
    icon,
    wind,
    humidity,
    selectedDate: Date,
  });

  //console.log(card);
});

//==================================================== WEATHER FETCH ========================================
function getWeatherDetails(name, lat, lon, country, state) {
  searchedPlace = { name, state, country };
  let WEATHR_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    FORCAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

  fetch(WEATHR_API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log("todays weather", data);
      let date = new Date();
      todayTempC = (data.main.temp - 273.15).toFixed(0);
      condition=data.weather[0].main;

      //Update current  weather UI section
      displayWeatherDashbord({
        tempC: todayTempC,
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        selectedDate: date,
      });
    })
    .catch(() => {
      customAlert(`fail to feth current Weather`);
    });
  //////Fetch 5 day forcast data
  fetch(FORCAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueDays = [];
      const fiveDay = data.list.filter((item) => {
        const day = new Date(item.dt_txt).getDate();
        if (!uniqueDays.includes(day)) {
          uniqueDays.push(day);
          return true;
        }
      });
      displayFocastCards(fiveDay);
    }) .catch(() => {
      customAlert(`fail to feth forcast data`);
    });
}

// =================================================================================================================================
//=================================================take out city details & coordinates=====================================

searchBtn.addEventListener("click", getcityInput); ////acces city by search button

cityInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    console.log(e.key);
    getcityInput(); ////acess city by press "enter" button
  }
});
///////////////getcity inoromation (Geocoding cityName to cordinate)/////////
function getcityInput() {
  const city = cityInput.value.trim();
  if (!city) return customAlert("Enter a city name.");

  cityInput.value = "";

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return customAlert("City not found.");

      const { name, lat, lon, country, state } = data[0];
      console.log(data);
      getWeatherDetails(name, lat, lon, country, state); //display weather details
      saveCity(name);
    })
    .catch(() => customAlert("Failed to fetch city data."));
}

// ///////////////getcity inoromation by USE CURRENT LOCATION(revers Geocoding city name to cordinate)
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return customAlert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;

      fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.length) return customAlert("Location not found.");

          const { name, country, state } = data[0];
          console.log(data);
          console.log(data[0]);

          saveCity(name);
          getWeatherDetails(name, lat, lon, country, state); //display weather details
        })
        .catch(() => customAlert("Failed to fetch location data."));
    },
    () => customAlert("Location access denied."),
  );
});

///========================================================dropdown menu==============================
// SHOW dropdown

function showDropdown() {
  inputDropdownBox.classList.remove("hidden");
  setTimeout(() => {
    inputDropdownBox.classList.remove("opacity-0", "scale-y-95");
    inputDropdownBox.classList.add("opacity-100", "scale-y-100");
  }, 10);
}
// HIDE dropdown
function hideDropdown() {
  inputDropdownBox.classList.remove("opacity-100", "scale-y-100");
  inputDropdownBox.classList.add("opacity-0", "scale-y-95");

  setTimeout(() => {
    inputDropdownBox.classList.add("hidden");
  }, 200); // match transition duration
}

cityInput.addEventListener("focusin", () => {
  if (recentCities.length !== 0) {
    showDropdown();
  }
}); // Focus in → show
// Click outside → hide
document.addEventListener("click", (e) => {
  if (!cityInput.contains(e.target) && !inputDropdownBox.contains(e.target)) {
    hideDropdown();
  }
});

//load recent from localStorage on dropDownbox
function renderDropdown() {
  inputDropdownBox.innerHTML = "";
  if (!recentCities) {
    hideDropdown();
  }
  recentCities.forEach((city) => {
    const div = document.createElement("div");
    div.className =
      "dopDownCard hover:cursor-pointer mb-0.5 px-4 text-center md:px-1 py-1 rounded-xl  bg-indigo-400  text-white";

    div.textContent = city;

    div.addEventListener("click", () => {
      cityInput.value = city;
      getcityInput();
      hideDropdown();
      console.log(city, ":clicked");
    });

    inputDropdownBox.appendChild(div);
  });
}

//// Save Recent Citys in local storage
function saveCity(city) {
  // Remove duplicate
  recentCities = recentCities.filter(
    (c) => c.toLowerCase() !== city.toLowerCase(),
  );

  // Add to top
  recentCities.unshift(city);

  // Keep only last 5 cities
  if (recentCities.length > 5) {
    recentCities.pop();
  }

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderDropdown();
}
renderDropdown();
