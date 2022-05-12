window.addEventListener('load', function() {
    localStorage.removeItem('cityName')
    localStorage.removeItem('cityURL')
})

// api documentation https://openweathermap.org/api/one-call-api

let apiKey = 'c2472aea17954013d40705840bcbffd4';

let latLonBase = 'https://api.openweathermap.org/geo/1.0/direct?q=';
let cityBaseURL = 'https://api.openweathermap.org/data/2.5/onecall?'
let cityNameURL = 'https://api.openweathermap.org/data/2.5/weather?'

let city = document.getElementById('city-input');
let search = document.getElementById('city-search');
let curDayBlock = document.getElementById('day0');
let days = document.querySelectorAll('.day');

//TODO: add history of cities used as buttons underneath the search button
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

search.addEventListener('click', function(e) {
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

                        // Why doesn't this work? why do i need a second console.log again for this?
                        let searchHistory = JSON.parse(localStorage.getItem('pastCities'))
                        searchHistory.push(this.dataset.name + ', ' + this.dataset.state)
                        console.log(searchHistory)
                        localStorage.setItem('pastCities', JSON.stringify(searchHistory))
                    })
                }
            })
        }
    })
})

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
        let pastBtnEl = document.createElement('button')
        pastBtnEl.classList.add('btn', 'btn-info')
        pastBtnEl.textContent = searchHistory[i]
        pastSearch.appendChild(pastBtnEl)
    }
    localStorage.setItem('pastCities', JSON.stringify(searchHistory))
}
addSearchHistory();

fetch(localStorage.getItem('cityName'))
    .then (function(response) {
        response.json()
            .then (function(data) {
                curDayBlock.innerHTML = '<h2>' + data.name + '</h2>'
            })
    })

let dayDateArr = [];
let dayWeatherArr = [];
let dayTempArr = [];
let dayHumidArr = [];
let dayUvArr = [];
let dayWindArr = [];

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

                if (curWeather >= 200 && curWeather <= 232) {
                    weatherToday.setAttribute('src', './Assets/Images/thunder.png')
                } else if (curWeather >= 500 && curWeather <= 531) {
                    weatherToday.setAttribute('src', './Assets/Images/rain.png')
                } else if (curWeather >= 600 && curWeather <= 622) {
                    weatherToday.setAttribute('src', './Assets/Images/snow.png')
                } else if (curWeather >= 701 && curWeather <= 781) {
                    weatherToday.setAttribute('src', './Assets/Images/mist.png')
                } else if (curWeather == 800) {
                    weatherToday.setAttribute('src', './Assets/Images/clear.png')
                } else if (curWeather >= 801 && curWeather <= 802) {
                    weatherToday.setAttribute('src', './Assets/Images/few-clouds.png')
                } else {
                    weatherToday.setAttribute('src', './Assets/Images/clouds.png')
                }

                for (var i = 1; i < 5; i++) {
                    dayDateArr.push(data.daily[i].dt)
                    dayWeatherArr.push(data.daily[i].weather[0].id)
                    dayTempArr.push(data.daily[i].temp.day)
                    dayHumidArr.push(data.daily[i].humidity)
                    dayUvArr.push(data.daily[i].uvi)
                    dayWindArr.push(data.daily[i].wind_speed)
                }

                function popDays() {
                    for (var i = 0; i < 4; i++) {
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
                        dayDate.textContent = moment.unix(dayDateArr[i]).format('MM/DD/YYYY')
                        tempDay.textContent = 'Temperature: ' + dayTempArr[i] + ' °F'
                        humidDay.textContent = 'Humidity: ' + dayHumidArr[i]
                        uvDay.textContent = 'UV index: ' + dayUvArr[i]
                        windDay.textContent = 'Wind speed: ' + dayWindArr[i] + ' MPH'
                        days[i].classList.add('daily')

                        if (dayWeatherArr[i] >= 200 && dayWeatherArr[i] <= 232) {
                            weatherDay.setAttribute('src', './Assets/Images/thunder.png')
                        } else if (dayWeatherArr[i] >= 500 && dayWeatherArr[i] <= 531) {
                            weatherDay.setAttribute('src', './Assets/Images/rain.png')
                        } else if (dayWeatherArr[i] >= 600 && dayWeatherArr[i] <= 622) {
                            weatherDay.setAttribute('src', './Assets/Images/snow.png')
                        } else if (dayWeatherArr[i] >= 701 && dayWeatherArr[i] <= 781) {
                            weatherDay.setAttribute('src', './Assets/Images/mist.png')
                        } else if (dayWeatherArr[i] == 800) {
                            weatherDay.setAttribute('src', './Assets/Images/clear.png')
                        } else if (dayWeatherArr[i] >= 801 && dayWeatherArr[i] <= 802) {
                            weatherDay.setAttribute('src', './Assets/Images/few-clouds.png')
                        } else {
                            weatherDay.setAttribute('src', './Assets/Images/clouds.png')
                        }
                    }
                }
                popDays();
            })
    })