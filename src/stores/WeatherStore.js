import { defineStore } from 'pinia'
import currentWeatherApi from '@/services/currentWeatherApi'
import dailyWeatherApi from '@/services/dailyWeatherApi'
import icons from '@/constants/weatherIcons'
export const useWeatherStore = defineStore('WeatherStore', {
    state: () => {
        return {
            currentCityName: '',
            dailyWeather: null,
            dailyWeatherLoading: null,
            currentWeather: null,
            currentWeatherLoading: null,
            weatherLoading: null,
            currentHours: null,
            weatherIcons: [
                {
                    iconCode: '01d',
                    icon: icons.sunIcon
                },
                {
                    iconCode: '01n',
                    icon: icons.moonIcon
                },
                {
                    iconCode: '02d',
                    icon: icons.fewCloudsIcon
                },
                {
                    iconCode: '02n',
                    icon: icons.moonCloudsIcon
                },
                {
                    iconCode: '03d',
                    icon: icons.fewCloudsIcon
                },
                {
                    iconCode: '03n',
                    icon: icons.moonCloudsIcon
                },
                {
                    iconCode: '04d',
                    icon: icons.scatteredCloudsIcon
                },
                {
                    iconCode: '04n',
                    icon: icons.scatteredCloudsIcon
                },
                {
                    iconCode: '09d',
                    icon: icons.showerRainIcon
                },
                {
                    iconCode: '09n',
                    icon: icons.moonShowerRainIcon
                },
                {
                    iconCode: '10d',
                    icon: icons.rainIcon
                },
                {
                    iconCode: '10n',
                    icon: icons.moonRainIcon
                },
                {
                    iconCode: '13d',
                    icon: icons.snowIcon
                },
                {
                    iconCode: '13n',
                    icon: icons.moonSnowIcon
                },
                {
                    iconCode: '50d',
                    icon: icons.mistIcon
                },
                {
                    iconCode: '50n',
                    icon: icons.mistIcon
                },
            ]
        }
    },
    actions: {
        setCityName(name) {
            this.currentCityName = name
        },
        async getWeather(lat, lon) {
            this.weatherLoading = true
            const currentWeather = await currentWeatherApi(lat, lon)
            const daliyWeather = await dailyWeatherApi(lat, lon)
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
                let dayDate = new Date(day.dt * 1000).toLocaleString('ru',
                    {
                        day: 'numeric',
                        month: 'long',
                    });
                day.date = dayDate
            })
            this.dailyWeather = dailyWeather
        }
    }
})