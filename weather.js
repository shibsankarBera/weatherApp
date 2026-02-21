// select elements
const cityInput = document.getElementById("city_Input"),
  searchBtn = document.getElementById("search_Btn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "8930bec60aaae2ab092dff58c1988c4a",
  currentWeatherCard = document.getElementById("currentWeather");


  ///---------Temparature in farenhite toogle-----
function celcToFahr(n) {
  return (n * 9.0) / 5.0 + 32.0;
}

function getWeatherDetails(name, lat, lon, country, state) {
  let WEATHR_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    FORCAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saurday",
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
    ];

  fetch(WEATHR_API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log("todays weather", data);
      let date = new Date();
      let tempC = (data.main.temp - 273.15).toFixed(0);
      let tempF = celcToFahr(tempC).toFixed(0);
      console.log(data.weather[0].description);
      //Update current  weather UI section
      currentWeatherCard.innerHTML = `
          <!-- Date Row -->
          <div class="flex justify-between text-sm opacity-80 mb-6">
            <span>${date.getDate()}th${months[date.getMonth()]} ,${date.getFullYear()} </span>
            <span>${days[date.getDay()]}</span>
            <span>${date.getHours() % 12 || 12}:${date.getMinutes()} ${date.getHours() >= 12 ? "PM" : "AM"}</span>
          </div>

          <!-- Middle Section -->
          <div class="flex items-center justify-between">

            <!-- Left -->
            <div class="w-1/2">
              <p class="uppercase text-sm opacity-80">${data.weather[0].description}</p>

              <h1 class="text-5xl md:text-6xl font-light mt-2">
                ${tempC}°<span class="text-xl">C</span>
                <span class="text-lg md:text-2xl"> / ${tempF}°F</span>
              </h1>

              <div class="mt-4 space-y-1 text-sm">
                <p>Wind: ${data.wind.speed} m/s 💨</p>
                <p>Humidity: ${data.main.humidity}% 💧</p>
              </div>
            </div>

            <!-- Right -->
            <div class="w-1/2 flex flex-col items-center">
              <div
                class="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
              >
                <img
                  class="w-full h-full object-contain drop-shadow-lg"
                  src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                  alt="Weather Icon"
                />
              </div>

              <div class="text-center mt-3">
                <p class="text-xl md:text-2xl font-semibold">${name}</p>
                <p class="text-sm opacity-80"><span>${state}</span>,<span class="uppercase">${country}</span></p>
              </div>
            </div>
          </div>`;
    })
    .catch(() => {
      alert(`fail to feth current Weather`);
    });
   
}







  ///////// take out city details & coordinates//////////////
  //  SEARCH BY CITY
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city name.");

  cityInput.value = "";

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return alert("City not found.");

      const { name, lat, lon, country,state } = data[0];
      console.log(data);
      getWeatherDetails(name, lat, lon, country,state);
    })
    .catch(() => alert("Failed to fetch city data."));
});


// USE CURRENT LOCATION
locationBtn.addEventListener("click", () => {

  if (!navigator.geolocation)
    return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(pos => {

    const { latitude: lat, longitude: lon } = pos.coords;

    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`)
      .then(res => res.json())
      .then(data => {

        if (!data.length) return alert("Location not found.");

        const { name, country,state } = data[0];
        console.log(data)
        getWeatherDetails(name, lat, lon, country,state);
      })
      .catch(() => alert("Failed to fetch location data."));

  }, () => alert("Location access denied."));
});



