import { defineStore } from 'pinia'
export const useCitiesHistoryStore = defineStore('CitiesHistoryStore', {
    state: () => {
        return {
            citiesList: [

            ]
        }
    },
    actions: {
        addCity(city) {
            this.citiesList.forEach((el, idx) => {
                if (el.properties.formatted === city.properties.formatted) {
                    this.citiesList.splice(idx, 1)
                }
            })
            this.citiesList = [city, ...this.citiesList]
            localStorage.setItem('citiesHistoryList', JSON.stringify(this.citiesList))
        },
        getCitiesFromLS() {
            if(localStorage.getItem('citiesHistoryList')) {
                this.citiesList = JSON.parse(localStorage.getItem('citiesHistoryList'))
            }
        }
    }
})