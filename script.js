let userNotification = document.getElementById("userNotification");

let weatherIcon = document.getElementById("weatherIcon");

let weatherTemperature = document.getElementById("weatherTemperature");

let weatherDescription = document.getElementById("weatherDescription");

let userLocation = document.getElementById("userLocation");

let kelvin = 273;

let apiKey = "11793562357b04c38a206416e8384ea1";

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    userNotification.style.display = "block";
    userNotification.innerHTML = `<p>Browser doesn't support Geolocation</p>`;
}

function setPosition(position) {
    let latitude = position.coords.latitude;

    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function showError(error) {
    userNotification.style.display = "block";
    userNotification.style.backgroundColor = "red";
    userNotification.innerHTML = `<p>Browser doesn't support Geolocation</p>`;
}

let weather = {
    temperature: {
        value: 0,
        unit: "celsius"
    },
    description: "",
    iconId: "",
    city: "",
    country: ""
};

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();

            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - kelvin);

            weather.description = data.weather[0].description;

            weather.iconId = data.weather[0].icon;

            weather.city = data.name;

            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}

function displayWeather() {
    weatherIcon.innerHTML = `<img src="/icons/${weather.iconId}.png" />`;

    weatherTemperature.innerHTML = `<a><p>${weather.temperature.value}°<span>C</span></p></a>`;

    weatherDescription.innerHTML = `<p>${weather.description}</p>`;

    userLocation.innerHTML = `<p>${weather.city}, ${weather.country}</p>`;
}

function celsiusToFahrenheit() {
    if (weather.temperature.unit === "undefined") return;
    if (weather.temperature.unit === "celsius") {
        let fahrenheit = (weather.temperature.value * 9) / 5 + 32;

        weatherTemperature.innerHTML = `<a><p>${fahrenheit.toFixed()}°<span>F</span></p></a>`;

        weather.temperature.unit = "fahrenheit";
    } else if (weather.temperature.unit === "fahrenheit") {
        weatherTemperature.innerHTML = `<a><p>${weather.temperature.value}°<span>C</span></p></a>`;

        weather.temperature.unit = "celsius";
    }
}

weatherTemperature.addEventListener("click", celsiusToFahrenheit);
