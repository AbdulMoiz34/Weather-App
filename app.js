const API_KEY = "33dd26113d18b9f790ac0cc69bdc0301";
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
        console.log(err.message);
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
    console.log(getLocalTime(dt, timezone));
}

const getLocalTime = (timestamp, timezoneOffset) => {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};
const main = async (current = inp.value) => {
    try {
        document.getElementById("loader").style.display = "block";
        document.querySelector(".detail-section").style.opacity = "0%";
        const data = await getData(current);
        displayWeather(data);
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";

    } catch (err) {
        document.getElementById("loader").style.display = "none";
        document.querySelector(".detail-section").style.opacity = "100%";
        document.querySelector(".detail-section").innerHTML = `<div style="text-align:center;">something went wrong.</div>`;
    }
}

main(true);