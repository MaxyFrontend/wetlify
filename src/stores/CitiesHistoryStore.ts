import { defineStore } from 'pinia'
import type city from '@/types/city'
interface state {
  citiesList: city[] | []
}
export const useCitiesHistoryStore = defineStore('CitiesHistoryStore', {
  state: ():state => {
    return {
      citiesList: []
    }
  },
  actions: {
    addCity(city: city):void {
      this.citiesList.forEach((el: city, idx) => {
        if (el.properties.formatted === city.properties.formatted) {
          this.citiesList.splice(idx, 1)
        }
      })
      this.citiesList = [city, ...this.citiesList]
      localStorage.setItem('citiesHistoryList', JSON.stringify(this.citiesList))
    },
    getCitiesFromLS() {
      if (localStorage.getItem('citiesHistoryList')) {
        this.citiesList = JSON.parse(localStorage.getItem('citiesHistoryList') || '')
      }
    }
  }
})
