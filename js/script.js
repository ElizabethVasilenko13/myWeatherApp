let apiKey ="1aab98fcee055bc5a48c36f9c5c11358";
let cityName = document.querySelector(".icon-text");
let linkCelsius = document.querySelector("#celsius");
let linkFahrenheit = document.querySelector("#fahrenheit");
let unitC = "metric";
let unitF = "imperial";
let temp = document.querySelector(".content-degrees");


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

//setInterval(() => showData(), 1000);
function showData(date){
	//let date = new Date();
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
	if (hour >= 20){
		switchTheme();
	} 
}
showData(new Date());
function showDefaultCityWeather(){
	let cityElement = document.getElementById("default-city").textContent;
	let defaultApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityElement}&appid=${apiKey}&units=${unitC}`;
	axios.get(defaultApiUrl).then(getWeather);
}

//EventListener for location form
document.querySelector("#search-form").addEventListener("submit", (e) => {
	let input = document.querySelector("#search-input");
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=${unitC}`;
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
					<span id="temp" class="block-degrees">${Math.round((Math.round(forecastDay.temp.max) + Math.round(forecastDay.temp.min))/2)}°</span>
					</div>
			</div>`;
			
				
			
		}
		/* temp = Math.round((Math.round(forecast[index].temp.max) + Math.round(forecast[index].temp.min))/2);
		return temp  (index < 5); */ 
	}); 
/* 	forecast.forEach(getTemp);
	function getTemp(el, index){
		if(index < 5){
			 temp = Math.round((Math.round(forecast[index].temp.max) + Math.round(forecast[index].temp.min))/2);
			return temp;
		}
	} */
	temp1 = Math.round((Math.round(forecast[0].temp.max) + Math.round(forecast[0].temp.min))/2);
	temp2 = Math.round((Math.round(forecast[1].temp.max) + Math.round(forecast[1].temp.min))/2);
	temp3 = Math.round((Math.round(forecast[2].temp.max) + Math.round(forecast[2].temp.min))/2);
	temp4 = Math.round((Math.round(forecast[3].temp.max) + Math.round(forecast[3].temp.min))/2);
	temp5 = Math.round((Math.round(forecast[4].temp.max) + Math.round(forecast[4].temp.min))/2);
	
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
					<span id="min-temp"class="block-degrees">Min: ${Math.round(forecast[1].temp.min)}°</span>
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

// function getFahrenheitTemp(response){
// 	let forecast = response.data.daily;
// 	console.log(forecast);

// 	let forecastElement = document.querySelector(".future-forecast-days");
// 	let forecastHtml = ``;
// 	forecast.forEach((forecastDay, index) => {
// 		if(index < 5){
// 			let average = Math.round((Math.round(forecastDay.temp.max) + Math.round(forecastDay.temp.min))/2);
// 			console.log(average);

// 			forecastHtml = forecastHtml +
// 			`
// 			<div class="days-block">
// 			<div class="block">
// 				<div class="block-title">${getForecastDays(forecastDay.dt)}</div>
// 					<img src="./img/${forecastDay.weather[0].icon}.svg" class="weather-icon" width="28" height="28"></img>
// 					<span id="temp" class="block-degrees">${average}°</span>
// 					</div>
// 			</div>`;
// 		}
// 	}); 

// 	//console.log(forecast);
// 	forecastHtml = forecastHtml + `</div>`;
// 	forecastElement.innerHTML = forecastHtml; 
// }
/* function getFahrenheit(coordinats){
	apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinats.lat}&lon=${coordinats.lon}&appid=${apiKey}&units=${unitF}`;
	console.log(apiUrl);
	axios.get(apiUrl).then(getFahrenheitTemp);
} */
function getWeather(response) {
	//let tempValue = Math.round(response.data.main.temp);
	celciusTemperature = response.data.main.temp;
	temp.innerHTML = Math.round(celciusTemperature);
	let iconElement = document.querySelector(".icon-element");
	getCoord(response.data.coord);
	//getFahrenheit(response.data.coord);
	iconElement.setAttribute("src",`./img/${response.data.weather[0].icon}.svg`);
	document.querySelector("#visib-id").innerHTML = (response.data.visibility/1000) + "km";
	document.querySelector("#humid-id").innerHTML = (response.data.main.humidity) + "%";
	document.querySelector("#wind-id").innerHTML = (response.data.wind.speed) + "km/h";
	document.querySelector(".content-weater").innerHTML = response.data.weather[0].main;
	cityName.innerHTML = response.data.name;
}


//change Celsius/Fahrenheit function
function showCelsiusTemp(e){
	e.preventDefault();
	linkCelsius.classList.add("active");
	linkFahrenheit.classList.remove("active");

	temp.innerHTML = Math.round(celciusTemperature);
	document.querySelector("#tomorrow-weather").innerHTML = `${tomorrowTemp}°`;
	document.querySelector("#min-temp").innerHTML = `Min: ${lowTemp}°`;
    document.querySelector("#max-temp").innerHTML = `Max: ${highTemp}°/`;

	
	let forecastMax = document.querySelectorAll("#temp");
	// forecastMax.forEach((el, index) => {
	// 	el[index].innerHTML = temp;
	// });
	forecastMax[0].innerHTML = temp1 + "°";
	forecastMax[1].innerHTML = temp2+ "°";
	forecastMax[2].innerHTML = temp3+ "°";
	forecastMax[3].innerHTML = temp4+ "°";
	forecastMax[4].innerHTML = temp5+ "°";
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
    document.querySelector("#max-temp").innerHTML = `Max: ${Math.round((highTemp * 9) / 5 + 32)}°/`;
	//getFahrenheitTemp();
	let forecastAv = document.querySelectorAll("#temp");
	forecastAv[0].innerHTML = Math.round((temp1 * 9) / 5 + 32)+ "°";
	forecastAv[1].innerHTML = Math.round((temp2 * 9) / 5 + 32)+ "°";
	forecastAv[2].innerHTML = Math.round((temp3 * 9) / 5 + 32)+ "°";
	forecastAv[3].innerHTML = Math.round((temp5 * 9) / 5 + 32)+ "°";
	forecastAv[4].innerHTML = Math.round((temp5 * 9) / 5 + 32)+ "°";
	
	linkCelsius.addEventListener("click", showCelsiusTemp);
  	linkFahrenheit.removeEventListener("click", showFahrenheitTemp);
}

let celciusTemperature = null;
linkCelsius.addEventListener("click", showCelsiusTemp);

linkFahrenheit.addEventListener("click", showFahrenheitTemp);


function retrievePosition(position) {
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  	axios.get(apiUrl).then(getWeather);
}

//theme-switcher
function switchTheme(e){
	document.querySelector(".switch-btn").classList.toggle("switch-on");
	document.querySelector("body").classList.toggle("dark");
	document.querySelector("body").classList.toggle("light");
}
document.querySelector(".switch-btn").addEventListener("click", switchTheme);

showDefaultCityWeather();