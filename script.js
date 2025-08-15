let cityInput = document.getElementById('city-input');
let searchButton = document.getElementById('search-button');
let api_key = '1af2c5efb159f072bd8e6fc7a20b062f';
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
let fiveDaysForecastCard = document.querySelectorAll('.day-forecast')[0];


function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // console.log(data);
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-solid fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}, ${date.toLocaleTimeString()}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;
    }).catch(() => {
        alert('Failed to fetch current weather!');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        // API returns forecast after 3 hours gap.
        // Need to filter unique day forecast.
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(fiveDaysForecast);
        fiveDaysForecastCard.innerHTML = ``;
        for (let i=0; i<fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            // console.log(i);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('Failed to fetch weather forecast!');
    })
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityInput) return;
    let GEO_CODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEO_CODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to Catch Co-ordinates of ${cityName}`);
    });
}


// ---------------- Main Search by City Name ----------------------

searchButton.addEventListener('click', getCityCoordinates);

// Press Enter to trigger searchButton
cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchButton.click(); // Simulates clicking the search button
    }
});


