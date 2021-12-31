var searchHistory = [];
var weatherAPI = 'https://api.openweathermap.org';
var weatherAPIKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var today = document.querySelector('#today');
var forcast = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

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