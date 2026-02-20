// select elements
const cityInput = document.getElementById("city_Input"),
  searchBtn = document.getElementById("search_Btn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "8930bec60aaae2ab092dff58c1988c4a",
  currentWeatherCard = document.getElementById("currentWeather");





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

      const { name, lat, lon, country } = data[0];
      console.log(data);
      //getWeatherDetails(name, lat, lon, country);
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

        const { name, country } = data[0];
        console.log(data)
        //getWeatherDetails(name, lat, lon, country);
      })
      .catch(() => alert("Failed to fetch location data."));

  }, () => alert("Location access denied."));
});



