var searchHistory = [];
var weatherAPI = 'https://api.openweathermap.org';
var weatherAPIKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var today = document.querySelector('#today');
var forcast = document.querySelector('#forecast');
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
    today


    
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