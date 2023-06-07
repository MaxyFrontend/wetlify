<template>
    <button :class="['get-current-location__btn', props.class]" @click="getCurrentLocation">
        <CurrentLocationIcon />
        <span class="get-current-location_btn_text">Текущая геопозиция</span>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref, PropType } from 'vue'
import CurrentLocationIcon from './Icons/CurrentLocationIcon.vue'
import { useWeatherStore } from '@/stores/WeatherStore'
import { useCitiesHistoryStore } from '@/stores/CitiesHistoryStore'
import getCityApi from '@/services/getCityApi'
const WeatherStore = useWeatherStore()
const CitiesHistoryStore = useCitiesHistoryStore()
const currentCity: Ref<string> = ref('')
const currentCountry: Ref<string> = ref('')
const getCity = async (lat: number, lon: number) => {
    const response = await getCityApi(lat, lon)
    console.log(response)
    if (response instanceof Error) {
        alert('Что-то пошло не так, попробуйте позже')
        return
    }
    currentCity.value = response.properties.city
    currentCountry.value = response.properties.country
    WeatherStore.setCityName(`${currentCity.value}, ${currentCountry.value}`)
    WeatherStore.getWeather(lat, lon)
    CitiesHistoryStore.addCity(response)
}
const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
        getCity(position.coords.latitude, position.coords.longitude);
    });
}
const props = defineProps({
    class: {
        type: String as PropType<string>,
        required: false,
    }
})
</script>

<style lang="scss">
.get-current-location__btn {
    display: flex;
    align-items: center;
}
.get-current-location_btn_text {
    font-size: 16px;
    line-height: 20px;
    max-width: 200px;
    margin-left: 15px;
}
@media (max-width:1200px) {
    .get-current-location_btn_text {
        font-size: 14px;
        line-height: 18px;
    }
}
@media (max-width:700px) {}
</style>