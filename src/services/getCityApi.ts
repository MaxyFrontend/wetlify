import type city from '@/types/city'
interface cityResponse {
    features: city[]
}
const apiKey: string = '800dd35af7b245af85b0701fa0cdd045'
const request = async (lat: number, lon: number): Promise<city | Error> => {
    try {
        const response: Response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?type=city&lat=${lat}&lon=${lon}&lang=ru&apiKey=${apiKey}`)
        if (response.ok) {
            const data: cityResponse = await response.json()
            return data.features[0]
        }
        else {
            throw new Error('Что-то пошло не так')
        }
    } catch (error: any) {
        return error
    }
}
export default request