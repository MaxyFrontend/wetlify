import { defineStore } from 'pinia'
import sunIcon from '@/assets/img/sun.png'
import moonIcon from '@/assets/img/moon.png'
import fewCloudsIcon from '@/assets/img/few-clouds.png'
import moonCloudsIcon from '@/assets/img/moon-clouds.png'
import scatteredCloudsIcon from '@/assets/img/scattered-clouds.png'
import showerRainIcon from '@/assets/img/shower-rain-clouds.png'
import moonShowerRainIcon from '@/assets/img/moon-showe-rain-clouds.png'
import rainIcon from '@/assets/img/rain-clouds.png'
import moonRainIcon from '@/assets/img/moon-rain-clouds.png'
import snowIcon from '@/assets/img/snow-clouds.png'
import moonSnowIcon from '@/assets/img/moon-snow-clouds.png'
import mistIcon from '@/assets/img/mist.png'
export const useCurrentCityStore = defineStore('CurrentCityStore', {
    state: () => {
        return {
            value: '',
            dailyWeather: null,
            dailyWeatherLoading:null,
            currentWeather: null,
            currentWeatherLoading:null,
            weatherLoading:null,
            currentHours: null,
            weatherIcons: [
                {
                    iconCode: '01d',
                    icon: sunIcon
                },
                {
                    iconCode: '01n',
                    icon: moonIcon
                },
                {
                    iconCode: '02d',
                    icon: fewCloudsIcon
                },
                {
                    iconCode: '02n',
                    icon: moonCloudsIcon
                },
                {
                    iconCode: '03d',
                    icon: fewCloudsIcon
                },
                {
                    iconCode: '03n',
                    icon: moonCloudsIcon
                },
                {
                    iconCode: '04d',
                    icon: scatteredCloudsIcon
                },
                {
                    iconCode: '04n',
                    icon: scatteredCloudsIcon
                },
                {
                    iconCode: '09d',
                    icon: showerRainIcon
                },
                {
                    iconCode: '09n',
                    icon: moonShowerRainIcon
                },
                {
                    iconCode: '10d',
                    icon: rainIcon
                },
                {
                    iconCode: '10n',
                    icon: moonRainIcon
                },
                {
                    iconCode: '13d',
                    icon: snowIcon
                },
                {
                    iconCode: '13n',
                    icon: moonSnowIcon
                },
                {
                    iconCode: '50d',
                    icon: mistIcon
                },
                {
                    iconCode: '50n',
                    icon: mistIcon
                },
            ]
        }
    },
    actions: {
        setCity(str) {
            this.value = str
        },
        async getWeather(lat, lon) {
            this.weatherLoading = true
            let apiKey = "9cae9e7ec59a9c3d8c06634e24a541a6"
            const currentWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${apiKey}`)
            const currentWeather = await currentWeatherRes.json()
            const daliyWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${apiKey}`)
            const daliyWeather = await daliyWeatherRes.json()
            this.setCurrentWeatherData(currentWeather)
            this.setDailyWeatherData(daliyWeather)
            this.weatherLoading = false
        },
        setCurrentWeatherData(currentWeatherData) {
            let currentWeather = currentWeatherData
            currentWeather.main.pressure *= 0.75
            for (let item in currentWeather.main) {
                let value = currentWeather.main[item]
                currentWeather.main[item] = Math.round(value)
            }
            let description = currentWeather.weather[0].description
            let descriptionArr = description.split('')
            descriptionArr[0] = descriptionArr[0].toUpperCase()
            description = descriptionArr.join('')
            currentWeather.weather[0].description = description
            this.weatherIcons.forEach(item => {
                if (item.iconCode === currentWeather.weather[0].icon) {
                    currentWeather.weather[0].icon = item.icon
                }
            })
            // cal current date & time
            const localOffset = new Date().getTimezoneOffset() * 60000;
            const utc = currentWeather.dt * 1000 + localOffset;
            currentWeather.currentHours = new Date(utc + 1000 * currentWeather.timezone).getHours();
            this.currentWeather = currentWeather
        },
        setDailyWeatherData(otherDaysWeatherData) {
            let dailyWeather = otherDaysWeatherData.list
            dailyWeather = dailyWeather.filter((item, idx) => {
                return (idx + 1) % 8 === 0
            })
            dailyWeather.forEach(day => {
                day.main.pressure *= 0.75
                for (let item in day.main) {
                    let value = day.main[item]
                    day.main[item] = Math.round(value)
                }
                let description = day.weather[0].description
                let descriptionArr = description.split('')
                descriptionArr[0] = descriptionArr[0].toUpperCase()
                description = descriptionArr.join('')
                day.weather[0].description = description
                this.weatherIcons.forEach(item => {
                    if (item.iconCode === day.weather[0].icon) {
                        day.weather[0].icon = item.icon
                    }
                })
                let dayDate = new Date(day.dt*1000).toLocaleString('ru',
                {
                  day: 'numeric',
                  month: 'long',
                });
                day.date = dayDate
            })
            this.dailyWeather = dailyWeather
        }
    },
})