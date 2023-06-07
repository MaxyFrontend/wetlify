import type {dailyWeatherData} from '@/types/dailyWeatherData'
const apiKey: string = "9cae9e7ec59a9c3d8c06634e24a541a6"
const request = async (lat: number, lon: number): Promise<dailyWeatherData | Error> => {
    try {
        const response: Response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${apiKey}`)
        if(response.ok) {
            const data = await response.json()
            return data
        }
        else {
            throw new Error('Что-то пошло не так')
        }

    } catch(error: any) {
        return error
    }
}
export default request