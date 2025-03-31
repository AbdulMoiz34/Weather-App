const API_KEY = "1125ff8e0c97c5318ef190d9ef8df86b";
const inp = document.getElementById("location-input");
const ACCESS_KEY = "gKDn59l-1u_7_xwxzxXo7VD6clixP4WCI6KV35eCbGQ";
const body = document.querySelector("body");

// Toggle mobile weather details panel
const mobileToggle = document.querySelector('.mobile-toggle');
const weatherDetails = document.querySelector('.weather-details');

mobileToggle.addEventListener('click', () => {
    weatherDetails.classList.toggle('active');
});

// Close panel when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isToggleButton = e.target.closest('.mobile-toggle');
        const isDetailsPanel = e.target.closest('.weather-details');

        if (!isToggleButton && !isDetailsPanel && weatherDetails.classList.contains('active')) {
            weatherDetails.classList.remove('active');
        }
    }
});

// get weather data from open weather API
const getData = async (loc) => {
    try {
        let api;
        if (loc === true) {
            const { longitude, latitude } = await currentLocation();
            api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        } else {
            api = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${API_KEY}`;
        }

        const res = await fetch(api);
        const data = await res.json();
        if (data.message) {
            throw new Error(data.message);
        }
        const { name: city,
            clouds: { all: cloud },
            sys: { country: countryCode },
            main: { temp, temp_min, temp_max, humidity },
            wind: { speed },
            weather: [{ main, icon, description }],
            timezone,
            dt,
        } = data;
        const country = getCountryName(countryCode);
        return { city, country, temp, temp_min, temp_max, humidity, speed, main, icon, description, cloud, timezone, dt };
    } catch (err) {
        throw new Error(err);
    }
}

// current location will get a location of the user.
const currentLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, err => reject("please allow location"));
    });
}

// will return country name based on code
const getCountryName = (countryCode) => {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
};

// It will display weather data
const displayWeather = ({ city, country, temp, temp_min, temp_max, humidity, speed, icon, description, cloud, timezone }) => {
    const countryEl = document.getElementById("city");
    const mainTempEl = document.querySelector(".main-temp");
    const iconEl = document.querySelector(".weather-icon>img");
    const minTempEl = document.getElementById("min-temp");
    const maxTempEl = document.getElementById("max-temp");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("wind");
    const cloudEl = document.getElementById("cloud");
    const weatherStatus = document.querySelector(".weather-status");
    const dateEl = document.getElementById("date&time");
    countryEl.innerText = `${city}, ${country}`;
    mainTempEl.innerText = `${temp}°C`;
    minTempEl.innerText = `${temp_min}°`;
    maxTempEl.innerText = `${temp_max}°`;
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    humidityEl.innerText = humidity + "%";
    windEl.innerText = `${speed} m/s`;
    cloudEl.innerText = `${cloud}%`;
    weatherStatus.innerText = description;
    dateEl.innerHTML = getLocalDateTime(timezone);
}

// will return url for background image a/c to weather.Unplash API has been used.
const changeBgImage = async (weather) => {
    let query = "";
    switch (weather) {
        case "Clear":
            query = "sunny sky";
            break;
        case "Clouds":
            query = "cloudy sky";
            break;
        case "Rain":
            query = "rainy weather";
            break;
        case "Thunderstorm":
            query = "stormy sky";
            break;
        case "Snow":
            query = "snowy landscape";
            break;
        case "Mist":
        case "Fog":
            query = "foggy weather";
            break;
        case "Haze":
            query = "hazy sky";
            break;
        case "Dust":
            query = "dusty weather";
            break;
        case "Tornado":
            query = "tornado sky";
            break;
        case "Squall":
            query = "windy weather";
            break;
        case "Ash":
            query = "volcanic ash";
            break;
        case "Blizzard":
            query = "blizzard snowstorm";
            break;
        default:
            query = "nature";
    }
    const res = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${ACCESS_KEY}`);
    const data = await res.json();
    return data.urls.regular;
}

// for getting date and time
const getLocalDateTime = (offsetInSeconds) => {
    const utcTime = moment.utc();
    const localTime = utcTime.add(offsetInSeconds, 'seconds');
    return localTime.format("ddd MMMM DD YYYY, h:mm A");
}

// main handler
const main = async (current = inp.value) => {
    try {
        document.getElementById("loader").style.display = "block";
        document.querySelector(".detail-section").style.opacity = "0%";
        const data = await getData(current);
        const bgImageUrl = await changeBgImage(data.main);
        body.style.backgroundImage = `url(${bgImageUrl})`;
        displayWeather(data);
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";
    } catch (err) {
        alert(err.message);
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";
    }
}

// ByDefault "true" for getting current location.
main(true);