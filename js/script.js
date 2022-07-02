
	let dayBlock = document.querySelector(".day");	
	let cityName = document.querySelector(".icon-text");
	let form = document.querySelector("#search-form");
	let linkCelsius = document.querySelector("#celsius");
	let linkFahrenheit = document.querySelector("#fahrenheit");
	let daysOfWeek = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			];
	let months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
	];

function showData (date){
	let day = date.getDay();
	let monthDay = date.getDate();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let month = date.getMonth();
	
	if (minutes < 10){
		minutes = `0${minutes}`;
	}else if (hour < 10){
		hour = `0${hour}`;
	}else if (hour <= 12){
		hour = `${hour}:${minutes}am`;
	}else {
		hour = `${hour}:${minutes}pm`;
	}
	dayBlock.innerHTML = `${months[month]} ${monthDay}, ${daysOfWeek[day]} ${hour}`;
}
let apiKey ="1aab98fcee055bc5a48c36f9c5c11358";
let unit = "metric";	
let visibility = document.querySelector("#visib-id");
let humiditly = document.querySelector("#humid-id");
let windSpeed = document.querySelector("#wind-id");
let weatherStatus = document.querySelector(".content-weater");
let temp = document.querySelector(".content-degrees");
let currentBtn = document.querySelector("#btn-current");
let input = document.querySelector("#search-input");

function showDefaultCityWeather(){
	let cityElement = document.getElementById("default-city").textContent;
	console.log(cityElement);
	let defaultApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityElement}&appid=${apiKey}&units=${unit}`;
	axios.get(defaultApiUrl).then(getWeather);
}

form.addEventListener("submit", (e) => {
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=${unit}`;
	e.preventDefault();
	axios.get(apiUrl).then(getWeather);
	if(input.value) {
		cityName.innerHTML = input.value;
	}
});

currentBtn.addEventListener("click", e => {
	e.preventDefault();
	navigator.geolocation.getCurrentPosition(retrievePosition);
});


function getForecastDays(time){
	let date = new Date(time * 1000);
	let day = date.getDay();
  	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[day];
}

function getForecast(response){
	console.log(response.data);
	let forecast = response.data.daily;
	let forecastElement = document.querySelector(".future-forecast-days");
	let forecastHtml = ``;
	let element = document.querySelector(".future-forecast");
	let forecastHTml = ``;
	let currentDay = getForecastDays(response.data.daily[1].dt);
	console.log(currentDay);
	forecast.forEach((forecastDay, index) => {
		if(index < 5){
			forecastHtml = forecastHtml +
			`
			<div class="days-block">
			<div class="block">
				<div class="block-title">${getForecastDays(forecastDay.dt)}</div>
					<img src="./img/${forecastDay.weather[0].icon}.svg" class="weather-icon" width="28" height="28"></img>
					
					<span class="block-degrees reduce-font">${Math.round(forecastDay.temp.max)}°/<span class="block-degrees min">${Math.round(forecastDay.temp.min)}°</span></span>
					
					</div>
			</div>
			`;
		}
		
	}); 
	forecastHtml = forecastHtml + `</div>`;
	forecastElement.innerHTML = forecastHtml; 
	let tomorrowDegreesValue = Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2);
		forecastHTml = `
			<div class="block-forecast">
				<img src="./img/${forecast[1].weather[0].icon}.svg" class="fa-cloud-rain" width="130" height="130"></img>
				<div class="future-content">
					<div class="content-weater">Tomorrow</div>
					<div class="content-degrees">${Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2)}°</div>
					<div class="future-deskr">${forecast[1].weather[0].main}</div>
				</div>
			</div>`;
	forecastHTml = forecastHTml + `</div>`;
	element.innerHTML = forecastHTml;				
	
}

function getCoord(coordinats){
	apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinats.lat}&lon=${coordinats.lon}&appid=${apiKey}&units=metric`;
	//
	axios.get(apiUrl).then(getForecast);
	//axios.get(apiUrl).then();

}

function getWeather(response) {
	
	let tempValue = Math.round(response.data.main.temp);
	temp.innerHTML = tempValue;
	let iconElement = document.querySelector(".icon-element");
	console.log(response.data);

	changeUnit(tempValue);
	getCoord(response.data.coord);
	iconElement.setAttribute("src",`./img/${response.data.weather[0].icon}.svg`);
	visibility.innerHTML = (response.data.visibility/1000) + "km";
	humiditly.innerHTML = (response.data.main.humidity) + "%";
	windSpeed.innerHTML = (response.data.wind.speed) + "km/h";
	weatherStatus.innerHTML = response.data.weather[0].main;
	cityName.innerHTML = response.data.name;
}

function changeUnit (temperature) {
	
		linkCelsius.addEventListener("click", (e) => {
			e.preventDefault();
			linkCelsius.classList.add("active");
			linkFahrenheit.classList.remove("active");
			temp.innerHTML = temperature;
		});
		linkFahrenheit.addEventListener("click", (e) => {
			e.preventDefault();
			linkFahrenheit.classList.add("active");
			linkCelsius.classList.remove("active");
			temp.innerHTML = Math.round((temperature * 9) / 5 + 32);

		});
	}
	
function retrievePosition(position) {
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  	axios.get(apiUrl).then(getWeather);
}

showData(new Date());
showDefaultCityWeather();