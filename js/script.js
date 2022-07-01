
	let dayBlock = document.querySelector(".day");	
	let cityName = document.querySelector(".icon-text");
	let form = document.querySelector("#search-form");
	let linkCelsius = document.querySelector("#celsius");
	let linkFahrenheit = document.querySelector("#fahrenheit");

function showData (date){
	let day = date.getDay();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let daysOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"];
	if (minutes < 10){
		minutes = `0${minutes}`;
	}	
	if (hour < 10){
		hour = `0${hour}`;
	}
	if (hour <= 12){
		hour = `${hour}:${minutes}am`;
	} else {
		hour = `${hour}:${minutes}pm`;
	}
	dayBlock.innerHTML = `${daysOfWeek[day]} ${hour}`;
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

function getWeather(response) {
	temp.innerHTML = Math.round(response.data.main.temp);
	let tempValue = Math.round(response.data.main.temp);
	let iconElement = document.querySelector(".icon-element");

	function changeUnit () {
		linkCelsius.addEventListener("click", (e) => {
			e.preventDefault();
			linkCelsius.classList.add("active");
			linkFahrenheit.classList.remove("active");
			temp.innerHTML = tempValue;
		});
		linkFahrenheit.addEventListener("click", (e) => {
			e.preventDefault();
			linkFahrenheit.classList.add("active");
			linkCelsius.classList.remove("active");
			temp.innerHTML = Math.round((tempValue * 9) / 5 + 32);;
		});
	}
	changeUnit();
	iconElement.setAttribute("src",`./img/${response.data.weather[0].icon}.svg`);
	iconElement.classList.add("dd");
	visibility.innerHTML = (response.data.visibility/1000) + "km";
	humiditly.innerHTML = (response.data.main.humidity) + "%";
	windSpeed.innerHTML = (response.data.wind.speed) + "km/h";
	weatherStatus.innerHTML = response.data.weather[0].main;
	cityName.innerHTML = response.data.name;
}

function retrievePosition(position) {
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  	axios.get(apiUrl).then(getWeather);
}

showData(new Date());
showDefaultCityWeather();
