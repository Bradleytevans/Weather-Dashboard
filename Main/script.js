var searchHistory = [];
var weatherAPI = 'https://api.openweathermap.org';
var weatherAPIKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayCon = document.querySelector('#today');
var forecastCon = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function createSearchHistory() {
	searchHistoryContainer.innerHTML = '';
	for (var i = searchHistory.length - 1; i >= 0; i--) {
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.setAttribute('aria-controls', 'today forecast');
		btn.classList.add('history-btn', 'btn-history');
		btn.setAttribute('data-search', searchHistory[i]);
		btn.textContent = searchHistory[i];
		searchHistoryContainer.append(btn);
	}
}

function updateHistory(search) {
	if (searchHistory.indexOf(search) !== -1) {
		return;
	}
	searchHistory.push(search);
	localStorage.setItem('search-history', JSON.stringify(searchHistory));
	createSearchHistory();
}

function getSearchHistory() {
	var storedHistory = localStorage.getItem('search-history');
	if (storedHistory) {
		searchHistory = JSON.parse(storedHistory);
	}
	createSearchHistory();
}

function currentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');
    var temp = weather.temp;
    var windSpeed = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDesc = weather.weather[0].description || weather[0].main;
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherImg = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidEl = document.createElement('p');
    var uviEL = document.createElement('p');
    var uviBadge = document.createElement('button');
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);
    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidEl.setAttribute('class', 'card-text');
    heading.textContent = `${city} (${date})`;
    weatherImg.setAttribute('src', icon);
    weatherImg.setAttribute('alt', iconDesc);
    weatherImg.setAttribute('class', 'weather-img');
    heading.append(weatherImg);
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${windSpeed}mph`;
    humidEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidEl);
    uviEL.textContent = 'UV Index: ';
    uviBadge.classList.add('btn', 'btn-sm');
    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');
    } else {
        uviBadge.classList.add('btn-danger');
    }
    uviBadge.textContent = uvi;
    uviEL.append(uviBadge);
    cardBody.append(uviEL);
    todayCon.innerHTML = '';
    todayCon.append(card);
}

function forecastCard(forecast, timezone) {
    var unixTs = forecast.dt;
    var icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDesc = forecast.weather[0].description;
    var temp = forecast.temp.day;
    var { humidity } = forecast;
    var wind = forecast.wind_speed;
    var col = document.createElement('div');
	var card = document.createElement('div');
	var cardBody = document.createElement('div');
	var cardTitle = document.createElement('h5');
	var weatherImg = document.createElement('img');
	var tempEl = document.createElement('p');
	var windEl = document.createElement('p');
	var humidEl = document.createElement('p');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherImg, tempEl, windEl, humidEl);
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
	windEl.setAttribute('class', 'card-text');
	humidEl.setAttribute('class', 'card-text');
    cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
	weatherImg.setAttribute('src', icon);
	weatherImg.setAttribute('alt', iconDesc);
	tempEl.textContent = `Temp: ${temp} °F`;
	windEl.textContent = `Wind: ${wind} MPH`;
	humidEl.textContent = `Humidity: ${humidity} %`;
	forecastCon.append(col);
}

function renderForecast(dailyForecast, timezone) {
	var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
	var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
	var headingCol = document.createElement('div');
	var heading = document.createElement('h4');
	headingCol.setAttribute('class', 'col-12');
	heading.textContent = '5-Day Forecast:';
	headingCol.append(heading);
	forecastCon.innerHTML = '';
	forecastCon.append(headingCol);
	for (var i = 0; i < dailyForecast.length; i++) {
		if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
			forecastCard(dailyForecast[i], timezone);
		}
	}
}

function createItems(city, data) {
    currentWeather(city, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiUrl = `${weatherAPI}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherAPIKey}`;
    fetch(apiUrl).then(function(res) {
        return res.json();
    }).then(function(data)  {
        createItems(city, data);        
    }).catch(function (err) {
        console.error(err);
    });
}

function fetchCoords(search) {
    var apiUrl =  `${weatherAPI}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`;
    fetch(apiUrl).then(function (res) {
        return res.json();
    }).then(function (data) {
        if (!data[0]) {
            alert('Location not found');
        } else {
            updateHistory(search);
            fetchWeather(data[0]);
        }
    })
    .catch(function (err) {
        console.error(err);
    });
}

function searchFormSubmit(e) {
	if (!searchInput.value) {
		return;
	}
	e.preventDefault();
	var search = searchInput.value.trim();
	fetchCoords(search);
	searchInput.value = '';
}

function searchHistoryClick(e) {
	if (!e.target.matches('.btn-history')) {
		return;
	}
	var btn = e.target;
	var search = btn.getAttribute('data-search');
	fetchCoords(search);
}
getSearchHistory();
searchForm.addEventListener('submit', searchFormSubmit);
searchHistoryContainer.addEventListener('click', searchHistoryClick);
