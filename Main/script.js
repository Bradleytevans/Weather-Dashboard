var searchHistory = [];
var weatherAPI = 'https://api.openweathermap.org';
var weatherAPIKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayCon = document.querySelector('#today');
var forcastCon = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

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
    humidity.setAttribute('class', 'card-text');
    heading.textContent = `${city} (${date})`;
    weatherImg.setAttribute('src', icon);
    weatherImg.setAttribute('alt', iconDesc);
    weatherImg.setAttribute('class', 'weather-img');
    heading.append(weatherImg);
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${windSpeed}mph`;
    humidEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, temp, windEl, humidEl);
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
	var storedHistory = localStorage.getItem('search-histroy');
	if (storedHistory) {
		searchHistory = JSON.parse(storedHistory);
	}
	createSearchHistory();
}

function forecastCard(forecast, timezone) {
    var unixTs = forecast.date;
    var icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDesc = forecast.weather[0].description;
    var temp = forecast.temp_day;
    var humidity = forecast;
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
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidEl);
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
	windEl.setAttribute('class', 'card-text');
	humidityEl.setAttribute('class', 'card-text');
    cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
	weatherIcon.setAttribute('src', icon);
	weatherIcon.setAttribute('alt', iconDesc);
	tempEl.textContent = `Temp: ${tempF} °F`;
	windEl.textContent = `Wind: ${windMph} MPH`;
	humidityEl.textContent = `Humidity: ${humidity} %`;
	forecastCon.append(col);
}

