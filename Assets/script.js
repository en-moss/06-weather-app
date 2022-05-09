// window.addEventListener('load', function() {
//     localStorage.clear()
// })

//api documentation https://openweathermap.org/api/one-call-api

let apiKey = 'c2472aea17954013d40705840bcbffd4';

let latLonBase = 'https://api.openweathermap.org/geo/1.0/direct?q=';
let cityBaseURL = 'https://api.openweathermap.org/data/2.5/weather?'

let city = document.getElementById('citySearch');
let search = document.getElementById('cityBtn');
let cityList = document.getElementById('cityList');

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
                        let cityURL = cityBaseURL + 'lat=' + lat + '&lon=' + lon + '&appid=' + apiKey
                        localStorage.setItem('cityURL', cityURL);
                    })
                }
            })
        }
    })
})

// fetch(localStorage.getItem('cityURL'))
//     .then (function(response) {
//         response.json()
//             .then (function(data) {
//                 console.log(data)
//             })
//     })