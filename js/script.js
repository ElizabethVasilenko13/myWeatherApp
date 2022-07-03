let apiKey ="1aab98fcee055bc5a48c36f9c5c11358";
let cityName = document.querySelector(".icon-text");
let linkCelsius = document.querySelector("#celsius");
let linkFahrenheit = document.querySelector("#fahrenheit");
let unit = "metric";	
let temp = document.querySelector(".content-degrees");
let celciusTemperature = null;

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

setInterval(() => showData(), 1000);
function showData(){
	let date = new Date();
	let day = date.getDay();
	let monthDay = date.getDate();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let month = date.getMonth();
	let period = "";

	if (minutes < 10){
		minutes = `0${minutes}`;
	}else if (hour < 10){
		hour = `0${hour}`;
	}else if (hour <= 12){
		period = `am`;
	}else {
		period= `pm`;
	}
	//inject day-info into HTML
	document.querySelector(".day").innerHTML = `${months[month]} ${monthDay}, ${daysOfWeek[day]} ${hour}:${minutes}${period}`;
}

function showDefaultCityWeather(){
	let cityElement = document.getElementById("default-city").textContent;
	let defaultApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityElement}&appid=${apiKey}&units=${unit}`;
	axios.get(defaultApiUrl).then(getWeather);
}

//EventListener for location form
document.querySelector("#search-form").addEventListener("submit", (e) => {
	let input = document.querySelector("#search-input");
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=${unit}`;
	e.preventDefault();
	axios.get(apiUrl).then(getWeather);
	if(input.value) {
		cityName.innerHTML = input.value;
	}
});

//eventListener for currnet button
document.querySelector("#btn-current").addEventListener("click", e => {
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
	let forecast = response.data.daily;
	let forecastElement = document.querySelector(".future-forecast-days");
	let forecastHtml = ``;
	let element = document.querySelector(".future-forecast");
	let forecastHTml = ``;
	//let currentDay = getForecastDays(response.data.daily[1].dt);
	forecast.forEach((forecastDay, index) => {
		if(index < 5){
			forecastHtml = forecastHtml +
			`
			<div class="days-block">
			<div class="block">
				<div class="block-title">${getForecastDays(forecastDay.dt)}</div>
					<img src="./img/${forecastDay.weather[0].icon}.svg" class="weather-icon" width="28" height="28"></img>
					<span id="high-temp"class="block-degrees reduce-font">${Math.round(forecastDay.temp.max)}°/<span id="low-temp"class="block-degrees min">${Math.round(forecastDay.temp.min)}°</span></span>
					</div>
			</div>`;
		}
	}); 

	console.log(forecast);
	forecastHtml = forecastHtml + `</div>`;
	forecastElement.innerHTML = forecastHtml; 
	//let tomorrowDegreesValue = Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2);
		forecastHTml = `
			<div class="block-forecast">
				<img src="./img/${forecast[1].weather[0].icon}.svg" class="fa-cloud-rain" width="130" height="130"></img>
				<div class="future-content">
					<div class="content-weater">Tomorrow</div>
					<div class="future-deskr">${forecast[1].weather[0].main}</div>
					<div id="tomorrow-weather"class="content-degrees">${Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2)}°</div>
					<div>
					<span id="max-temp"class="block-degrees">Max: ${Math.round(forecast[1].temp.max)}°/</span>
					<span id="min-temp"class="block-degrees-min">Min: ${Math.round(forecast[1].temp.min)}°</span>
					</div>
				</div>
			</div>`;
	forecastHTml = forecastHTml + `</div>`;
	element.innerHTML = forecastHTml;		
	lowTemp = Math.round(forecast[1].temp.min);
  	highTemp = Math.round(forecast[1].temp.max);	
	tomorrowTemp = Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2);
}

function getCoord(coordinats){
	apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinats.lat}&lon=${coordinats.lon}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(getForecast);
}

function getWeather(response) {
	let tempValue = Math.round(response.data.main.temp);
	temp.innerHTML = tempValue;
	let iconElement = document.querySelector(".icon-element");
	changeUnit(tempValue);
	getCoord(response.data.coord);
	iconElement.setAttribute("src",`./img/${response.data.weather[0].icon}.svg`);
	document.querySelector("#visib-id").innerHTML = (response.data.visibility/1000) + "km";
	document.querySelector("#humid-id").innerHTML = (response.data.main.humidity) + "%";
	document.querySelector("#wind-id").innerHTML = (response.data.wind.speed) + "km/h";
	document.querySelector(".content-weater").innerHTML = response.data.weather[0].main;
	cityName.innerHTML = response.data.name;
	celciusTemperature = response.data.main.temp;
	console.log(celciusTemperature);
}

function showCelsiusTemp(e){
	e.preventDefault();
	linkCelsius.classList.add("active");
	linkFahrenheit.classList.remove("active");

	temp.innerHTML = Math.round(celciusTemperature);
	
	document.querySelector("#tomorrow-weather").innerHTML = `${tomorrowTemp}°`;
	document.querySelector("#min-temp").innerHTML = `Min: ${lowTemp}°`;
    document.querySelector("#max-temp").innerHTML = `Max: ${highTemp}°/`;

	let forecastMax = document.querySelectorAll("#high-temp");
	forecastMax.forEach(function (item) {
		let currentTemp = item.innerHTML;
		//convert to Celsius
		item.innerHTML= Math.round(((currentTemp - 32)* 5) / 9);
	});
	let forecastMin= document.querySelectorAll("#low-temp");
	forecastMin.forEach(function (item) {
 		let currentTemp= item.innerHTML;
  		item.innerHTML= Math.round(((currentTemp - 32)* 5) /9);
	});
	linkCelsius.removeEventListener("click", showCelsiusTemp);
  	linkFahrenheit.addEventListener("click", showFahrenheitTemp);
}

function showFahrenheitTemp(e){
	e.preventDefault();
	linkCelsius.classList.remove("active");
	linkFahrenheit.classList.add("active");
	temp.innerHTML = Math.round(((celciusTemperature * 9) / 5 + 32));

	document.querySelector("#tomorrow-weather").innerHTML = `${Math.round((tomorrowTemp * 9)/ 5 + 32)}°`;
	document.querySelector("#min-temp").innerHTML = `Min: ${Math.round((lowTemp * 9) / 5 + 32)}°`;
    document.querySelector("#max-temp").innerHTML =  `Max: ${Math.round((highTemp * 9) / 5 + 32)}°/`;

	let forecastMax = document.querySelectorAll("#high-temp");
	forecastMax.forEach(function (item) {
		let currentTemp = item.innerHTML;
		//convert to Celsius
		item.innerHTML= Math.round((currentTemp * 9) /5 + 32);
	});

	let forecastMin= document.querySelectorAll("#low-temp");
	forecastMin.forEach(function (item) {
 		let currentTemp= item.innerHTML;
  		item.innerHTML= Math.round((currentTemp * 9) /5 + 32);
	});
	linkCelsius.addEventListener("click", showCelsiusTemp);
  	linkFahrenheit.removeEventListener("click", showFahrenheitTemp);
}


linkCelsius.addEventListener("click", showCelsiusTemp);

linkFahrenheit.addEventListener("click", showFahrenheitTemp);


function retrievePosition(position) {
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  	axios.get(apiUrl).then(getWeather);
}

//theme-switcher
document.querySelector(".switch-btn").addEventListener("click", (e) => {
	e.preventDefault();
	document.querySelector(".switch-btn").classList.toggle("switch-on");
	document.querySelector("body").classList.toggle("dark");
	document.querySelector("body").classList.toggle("light");
});

showDefaultCityWeather();