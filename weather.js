// ============================================== SELECT ELEMENTS ==============================================================
const cityInput = document.getElementById("city_Input"),
  searchBtn = document.getElementById("search_Btn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "8930bec60aaae2ab092dff58c1988c4a",
  currentWeatherCard = document.getElementById("currentWeather");
   let inputDropdownBox=document.querySelector(".inputDropdownBox")

   // ==============================================    STATE/DATA  ============================================================
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];


// ================================================ UTILITIES & HELPER FUNCTIONS =============================================
///---------Temparature in farenhite toogle-----
function celcToFahr(n) {
  return (n * 9.0) / 5.0 + 32.0;  
}

//-----------------------------------------------feth & displyaying weather Details---------------------
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

// =================================================================================================================================
//=================================================take out city details & coordinates=====================================




searchBtn.addEventListener("click", getcityInput);  ////acces city by search button

cityInput.addEventListener("keypress", (e)=> {
  if(e.key=="Enter"){
    console.log(e.key)
    getcityInput();                              ////acess city by press "enter" button
  }
});
///////////////getcity inoromation (Geocoding cityName to cordinate)/////////
function getcityInput() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city name.");

  cityInput.value = "";

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert("City not found.");

      const { name, lat, lon, country, state } = data[0];
      console.log(data);
      getWeatherDetails(name, lat, lon, country, state);//display weather details
       saveCity(name);
    })
    .catch(() => alert("Failed to fetch city data."));
}

// ///////////////getcity inoromation by USE CURRENT LOCATION(revers Geocoding city name to cordinate)
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;

      fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.length) return alert("Location not found.");

          const { name, country, state } = data[0];
          console.log(data);
          saveCity(name);
          getWeatherDetails(name, lat, lon, country, state);//display weather details
         
        })
        .catch(() => alert("Failed to fetch location data."));
    },
    () => alert("Location access denied."),
  );
});




///-----------------------------dropdown menu------------------
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


cityInput.addEventListener("focusin",()=>{
  if(recentCities.length!==0){
    showDropdown();
  }
} );// Focus in → show
// Click outside → hide
document.addEventListener("click", (e) => {
  if (
    !cityInput.contains(e.target) &&
    !inputDropdownBox.contains(e.target)
  ) {
    hideDropdown();
  }
});



//load recent from localStorage on dropDownbox
function renderDropdown() {
  inputDropdownBox.innerHTML = "";
 if(!recentCities){
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
       console.log(city,":clicked")
    });

    inputDropdownBox.appendChild(div);
  });
}


//Save Recent Citys in local storage







function saveCity(city) {
  // Remove duplicate
  recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());

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

