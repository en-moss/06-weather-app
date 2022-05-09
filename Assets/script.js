let apiKey = 'c2472aea17954013d40705840bcbffd4';

let latLonBase = 'http://api.openweathermap.org/geo/1.0/direct?q=';

let city = document.getElementById('citySearch');
let search = document.getElementById('cityBtn');
let cityList = document.getElementById('cityList');

search.addEventListener('click', function(e) {
    e.preventDefault()
    let cityCoord = latLonBase + city.value + '&limit=5&appid=' + apiKey;
    console.log(cityCoord)
    
    fetch(cityCoord)
    .then (function (response) {
        if (response.ok) {
            response.json()
            .then (function(data) {
                for (let i = 0; i < data.length; i++) {
                    let cityBtnEl = document.createElement('button');
                    cityBtnEl.classList.add('cityBtn', 'btn', 'btn-warning');
                    cityBtnEl.setAttribute('id', i);
                    cityBtnEl.innerHTML='<strong>' + data[i].name + '</strong> ' + data[i].state;
                    cityList.appendChild(cityBtnEl);
                    
                    let cityButtons = document.querySelectorAll('.cityBtn')

                    cityButtons[i].addEventListener('click', function() {
                        console.log(this.id)
                    })
                }
            })
        }
    })
})