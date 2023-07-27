import { defineStore } from 'pinia'
import currentWeatherApi from '@/services/currentWeatherApi'
import dailyWeatherApi from '@/services/dailyWeatherApi'
import type currentWeatherData from '@/types/currentWeatherData'
import type { dailyWeatherData, dailyWeatherDataItem } from '@/types/dailyWeatherData'
import icons from '@/constants/weatherIcons'
interface weatherIcon {
    iconCode: string,
    icon: string
}
type State = {
    currentCityName: string,
    dailyWeather: null | dailyWeatherDataItem[],
    dailyWeatherLoading: null | boolean,
    currentWeather: null | currentWeatherData,
    currentWeatherLoading: null | boolean,
    weatherLoading: null | boolean,
    weatherIcons: weatherIcon[]
}
export const useWeatherStore = defineStore('WeatherStore', {
    state: (): State => {
        return {
            currentCityName: '',
            dailyWeather: null,
            dailyWeatherLoading: null,
            currentWeather: null,
            currentWeatherLoading: null,
            weatherLoading: null,
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
        setCityName(name: string): void {
            this.currentCityName = name
        },
        async getWeather(lat: number, lon: number): Promise<string> {
            this.weatherLoading = true
            const currentWeather = await currentWeatherApi(lat, lon)
            const dailyWeather = await dailyWeatherApi(lat, lon)
            if (!(currentWeather instanceof Error) && !(dailyWeather instanceof Error)) {
                this.setCurrentWeatherData(currentWeather)
                this.setDailyWeatherData(dailyWeather)
                this.weatherLoading = false
                return 'success'
            }
            else {
                alert('Что-то пошло не так, попробуйте позже')
                if (this.currentWeather === null && this.dailyWeather === null) {
                    this.weatherLoading = null
                }
                else {
                    this.weatherLoading = false
                }
                return 'failed'
            }
        },
        setCurrentWeatherData(currentWeatherData: currentWeatherData): void {
            const currentWeather: currentWeatherData = currentWeatherData
            currentWeather.main.pressure *= 0.75
            for (const item in currentWeather.main) {
                const value: number = currentWeather.main[item as keyof typeof currentWeather.main]
                currentWeather.main[item as keyof typeof currentWeather.main] = Math.round(value)
            }
            let description = currentWeather.weather[0].description
            const descriptionArr = description.split('')
            descriptionArr[0] = descriptionArr[0].toUpperCase()
            description = descriptionArr.join('')
            currentWeather.weather[0].description = description
            this.weatherIcons.forEach(item => {
                if (item.iconCode === currentWeather.weather[0].icon) {
                    currentWeather.weather[0].icon = item.icon
                }
            })
            this.currentWeather = currentWeather
        },
        setDailyWeatherData(otherDaysWeatherData: dailyWeatherData): void {
            let dailyWeather: dailyWeatherDataItem[] = otherDaysWeatherData.list
            if (dailyWeather.length > 0) {
                dailyWeather = dailyWeather.filter((item, idx: number) => {
                    return (idx + 1) % 8 === 0
                })
            }
            dailyWeather.forEach((day) => {
                day.main.pressure *= 0.75
                for (const item in day.main) {
                    const value = day.main[item as keyof typeof day.main]
                    day.main[item as keyof typeof day.main] = Math.round(value)
                }
                let description = day.weather[0].description
                const descriptionArr = description.split('')
                descriptionArr[0] = descriptionArr[0].toUpperCase()
                description = descriptionArr.join('')
                day.weather[0].description = description
                this.weatherIcons.forEach(item => {
                    if (item.iconCode === day.weather[0].icon) {
                        day.weather[0].icon = item.icon
                    }
                })
                const dayDate = new Date(day.dt * 1000).toLocaleString('ru',
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