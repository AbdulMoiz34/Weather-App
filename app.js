const API_KEY = "1125ff8e0c97c5318ef190d9ef8df86b";
const inp = document.getElementById("location-input");

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
        const { name: city,
            clouds: { all: cloud },
            sys: { country: countryCode },
            main: { temp, temp_min, temp_max, humidity },
            wind: { speed },
            weather: [{ main, icon, description }],
            timezone,
            dt,
            ...data
        } = await res.json();
        const country = getCountryName(countryCode);
        console.log(data);
        return { city, country, temp, temp_min, temp_max, humidity, speed, main, icon, description, cloud, timezone, dt };
    } catch (err) {
        console.log(err);
    }
}

const currentLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, err => reject(err));
    });
}

const getCountryName = (countryCode) => {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
};

const displayWeather = ({ city, country, temp, temp_min, temp_max, humidity, speed, icon, description, cloud, timezone, dt }) => {
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
    console.log(dt);
    console.log(timezone);
    dateEl.innerHTML = ``;
}

const main = async (current = inp.value) => {
    try {
        document.getElementById("loader").style.display = "block";
        document.querySelector(".detail-section").style.opacity = "0%";
        const data = await getData(current);
        console.log(data);
        displayWeather(data);
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";
    } catch (err) {
        console.log(err.message);
        alert(`${inp.value} not found.`);
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";
    }
}

main(true);