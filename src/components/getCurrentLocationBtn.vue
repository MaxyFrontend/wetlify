<template>
    <button :class="['get-current-location__btn', props.class]" @click="getCurrentLocation">
        <CurrentLocationIcon />
        <span class="get-current-location_btn_text">Текущая геопозиция</span>
    </button>
</template>

<script setup>
import { ref } from 'vue'
import CurrentLocationIcon from './Icons/CurrentLocationIcon.vue'
import { useCurrentCityStore } from '@/stores/CurrentCityStore.js'
const CurrentCityStore = useCurrentCityStore()
const currentCity = ref('')
const currentCountry = ref('')
const getCity = (lat, lon) => {
    let apiKey = '800dd35af7b245af85b0701fa0cdd045'
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=${apiKey}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw new Error('Something went wrong');
        })
        .then(result => {
            currentCity.value = result.features[0].properties.city
            currentCountry.value = result.features[0].properties.country
            CurrentCityStore.setCity(`${currentCity.value}, ${currentCountry.value}`)
            CurrentCityStore.getWeather(lat, lon)
        })
}
const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
        getCity(position.coords.latitude, position.coords.longitude);
    });
}
const props = defineProps({
    class: {
        type:String,
        required:false,
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
@media (max-width:700px) {
}
</style>