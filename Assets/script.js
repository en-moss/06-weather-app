window.addEventListener('load', function() {
    localStorage.removeItem('cityName')
    localStorage.removeItem('cityURL')
})

// api documentation https://openweathermap.org/api/one-call-api

let apiKey = config_key;

let latLonBase = 'https://api.openweathermap.org/geo/1.0/direct?q=';
let cityBaseURL = 'https://api.openweathermap.org/data/2.5/onecall?'
let cityNameURL = 'https://api.openweathermap.org/data/2.5/weather?'

let city = document.getElementById('city-input');
let search = document.getElementById('city-search');
let curDayBlock = document.getElementById('day0');
let days = document.querySelectorAll('.day');
let clear = document.getElementById('clear-history')

let pastSearch = document.getElementById('past-search');
let searchHistory = JSON.parse(localStorage.getItem('pastCities'))
function getSearches() {
    if (searchHistory == null) {
        let pastArr = [];
        localStorage.setItem('pastCities', JSON.stringify(pastArr));
    }
    else {
        return;
    }  
}

getSearches();

let modalBlock = document.getElementById('city-select');
let cityList = document.getElementById('city-list');
let exitBtn = document.getElementsByClassName('exit')[0];

search.addEventListener('click', searchCity)

function searchCity(e) {
    e.preventDefault()
    let cityCoord = latLonBase + city.value + '&limit=5&appid=' + apiKey;

    fetch(cityCoord)
    .then (function (response) {
        if (response.ok) {
            response.json()
            .then (function(data) {
                modalBlock.style.display='block';

                let line = document.createElement('hr')
                cityList.appendChild(line);

                //store lat and lon data in html data-attribute for recall in history button push
                for (let i = 0; i < data.length; i++) {
                    let cityBtnEl = document.createElement('button');
                    cityBtnEl.classList.add('city-btn', 'btn', 'btn-warning');
                    cityBtnEl.setAttribute('id', i);
                    cityBtnEl.setAttribute('data-name', data[i].name)
                    cityBtnEl.setAttribute('data-state', data[i].state)
                    cityBtnEl.innerHTML='<strong>' + data[i].name + '</strong> ' + data[i].state;
                    cityList.appendChild(cityBtnEl);
                    
                    let cityButtons = document.querySelectorAll('.city-btn')

                    cityButtons[i].addEventListener('click', function() {
                        let chosenCoords = this.id
                        let lat = data[chosenCoords].lat
                        let lon = data[chosenCoords].lon
                        let cityURL = cityBaseURL + 'lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly&appid=' + apiKey;
                        let cityName = cityNameURL + 'lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly&appid=' + apiKey;
                        localStorage.setItem('cityURL', cityURL);
                        localStorage.setItem('cityName', cityName)
                        modalBlock.style.display='none'

                        let searchHistory = JSON.parse(localStorage.getItem('pastCities'))
                        //turn this into an object with lat and lon as well so you can get to it in the future by clicking on search button
                        searchHistory.push(this.dataset.name + ', ' + this.dataset.state)
                        console.log(searchHistory)
                        localStorage.setItem('pastCities', JSON.stringify(searchHistory))
                    })
                }
            })
        }
    })
}

exitBtn.addEventListener('click', function() {
    modalBlock.style.display='none';
})

window.addEventListener('click', function(e) {
    if (e.target == modalBlock) {
        modalBlock.style.display = 'none'
    }
})

function addSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('pastCities'))
    for (var i = 0; i < searchHistory.length; i++) {
        // cycle through and if city name is already listed don't create a new one
        let pastBtnEl = document.createElement('button')
        pastBtnEl.classList.add('btn', 'btn-warning')

        pastBtnEl.textContent = searchHistory[i]
        pastSearch.appendChild(pastBtnEl)
    }
    localStorage.setItem('pastCities', JSON.stringify(searchHistory))
}
addSearchHistory(); //still have to add actual functionalist to buttons

clear.addEventListener('click', function() {
    localStorage.removeItem('pastCities')
    while (pastSearch.firstChild) {
        pastSearch.removeChild(pastSearch.lastChild);
    }
})

fetch(localStorage.getItem('cityName'))
    .then (function(response) {
        response.json()
            .then (function(data) {
                curDayBlock.innerHTML = '<h2>' + data.name + '</h2>'
            })
    })

fetch(localStorage.getItem('cityURL'))
    .then (function(response) {
        response.json()
            .then (function(data) {
                let curWeather = data.current.weather[0].id
                let curTemp = data.current.temp
                let curHumid = data.current.humidity
                let curUV = data.current.uvi
                let curWind = data.current.wind_speed
                let weatherToday = document.createElement('img')
                let tempToday = document.createElement('p')
                let humidToday = document.createElement('p')
                let uvToday = document.createElement('p')
                let windToday = document.createElement('p')
                curDayBlock.appendChild(weatherToday)
                curDayBlock.appendChild(tempToday)
                curDayBlock.appendChild(humidToday)
                curDayBlock.appendChild(uvToday)
                curDayBlock.appendChild(windToday)
                tempToday.textContent = 'Temperature: ' + curTemp + ' °F'
                humidToday.textContent = 'Humidity: ' + curHumid
                uvToday.textContent = 'UV index: ' + curUV
                windToday.textContent = 'Wind speed: ' + curWind + ' MPH'
                curDayBlock.classList.add('today')

                
                var iconURL = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
                weatherToday.setAttribute('src', iconURL)

                if (curUV <= 2) {
                    uvToday.classList.add('uvi-good')
                } else if (curUV <= 5 && curUV > 2) {
                    uvToday.classList.add('uvi-mod')
                } else if (curUV <= 7 && curUV > 5) {
                    uvToday.classList.add('uvi-high')
                } else {
                    uvToday.classList.add('uvi-v-high')
                }

                function popDays() {
                    for (var i = 1; i < 5; i++) {
                        var dayDate = document.createElement('h3')
                        var weatherDay = document.createElement('img')
                        var tempDay = document.createElement('p')
                        var humidDay = document.createElement('p')
                        var uvDay = document.createElement('p')
                        var windDay = document.createElement('p')
                        days[i].appendChild(dayDate)
                        days[i].appendChild(weatherDay)
                        days[i].appendChild(tempDay)
                        days[i].appendChild(humidDay)
                        days[i].appendChild(uvDay)
                        days[i].appendChild(windDay)
                        dayDate.textContent = moment.unix(data.daily[i].dt).format('MM/DD/YYYY')
                        tempDay.textContent = 'Temperature: ' + data.daily[i].temp.day + ' °F'
                        humidDay.textContent = 'Humidity: ' + data.daily[i].humidity
                        uvDay.textContent = 'UV index: ' + data.daily[i].uvi
                        windDay.textContent = 'Wind speed: ' + data.daily[i].wind_speed + ' MPH'
                        days[i].classList.add('daily')

                        console.log(data)
                        console.log(data.daily[i].weather[0].icon)

                        var iconURL = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
                        weatherDay.setAttribute('src', iconURL)

                        if (data.daily[i].uvi <= 2) {
                            uvDay.classList.add('uvi-good')
                        } else if (data.daily[i].uvi <= 5 && data.daily[i].uvi > 2) {
                            uvDay.classList.add('uvi-mod')
                        } else if (data.daily[i].uvi <= 7 && data.daily[i].uvi > 5) {
                            uvDay.classList.add('uvi-high')
                        } else {
                            uvDay.classList.add('uvi-v-high')
                        }
                    }
                }
                popDays();
            })
    })