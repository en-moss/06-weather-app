// window.addEventListener('load', function() {
//     localStorage.clear()
// })

//api documentation https://openweathermap.org/api/one-call-api

let apiKey = 'c2472aea17954013d40705840bcbffd4';

let latLonBase = 'https://api.openweathermap.org/geo/1.0/direct?q=';
let cityBaseURL = 'https://api.openweathermap.org/data/2.5/onecall?'
let cityNameURL = 'https://api.openweathermap.org/data/2.5/weather?'

let city = document.getElementById('citySearch');
let search = document.getElementById('cityBtn');
let cityList = document.getElementById('cityList');

let curDayBlock = document.getElementById('day0')
let days = document.querySelectorAll('#day')

search.addEventListener('click', function(e) {
    e.preventDefault()
    let cityCoord = latLonBase + city.value + '&limit=5&appid=' + apiKey;
    
    fetch(cityCoord)
    .then (function (response) {
        if (response.ok) {
            response.json()
            .then (function(data) {
                let line = document.createElement('hr')
                cityList.appendChild(line);
                for (let i = 0; i < data.length; i++) {
                    let cityBtnEl = document.createElement('button');
                    cityBtnEl.classList.add('cityBtn', 'btn', 'btn-warning');
                    cityBtnEl.setAttribute('id', i);
                    cityBtnEl.innerHTML='<strong>' + data[i].name + '</strong> ' + data[i].state;
                    cityList.appendChild(cityBtnEl);
                    
                    let cityButtons = document.querySelectorAll('.cityBtn')

                    cityButtons[i].addEventListener('click', function() {
                        let chosenCoords = this.id
                        let lat = data[chosenCoords].lat
                        let lon = data[chosenCoords].lon
                        let cityURL = cityBaseURL + 'lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly&appid=' + apiKey;
                        let cityName = cityNameURL + 'lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly&appid=' + apiKey;
                        localStorage.setItem('cityURL', cityURL);
                        localStorage.setItem('cityName', cityName)
                    })
                }
            })
        }
    })
})

fetch(localStorage.getItem('cityName'))
    .then (function(response) {
        response.json()
            .then (function(data) {
                curDayBlock.innerHTML = '<strong>' + data.name + '</strong>'
            })
    })

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

                
                for (let i = 1; i < 5; i++) {
                    dayWeatherArr.push(data.daily[i].weather[0].id)
                    dayTempArr.push(data.daily[i].temp.day)
                    dayHumidArr.push(data.daily[i].humidity)
                    dayUvArr.push(data.daily[i].uvi)
                    dayWindArr.push(data.daily[i].wind_speed)
                }
            })
    })

function popDays() {
    for (var i = 0; i < 4; i++) {
        days[i].innerHTML = dayTempArr[i];
        console.log(dayTempArr)
    }
}
popDays();