import type city from '@/types/city'
interface searchResponse {
    features: city[]
}
const apiKey: string = '800dd35af7b245af85b0701fa0cdd045'
const limit: number = 5
const request = async (searchQuery: string): Promise<city[] | Error> => {
    try {
        const response: Response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${searchQuery}&lang=ru&limit=${limit}&type=city&apiKey=${apiKey}`)
        if(response.ok) {
            const data: searchResponse = await response.json()
            return data.features
        }
        else {
            throw new Error('Что-то пошло не так');
        }
    } catch (error: any) {
        return error
    }
}
export default request