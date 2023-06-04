const apiKey:string = "9cae9e7ec59a9c3d8c06634e24a541a6"
const request = async (lat:number, lon:number) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${apiKey}`)
    return response.json()
}
export default request