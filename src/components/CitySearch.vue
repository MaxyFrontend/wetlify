<template>
    <div :class="['city-search', props.class, { 'dropdown-active': citiesSearchList !== null && inputFocused }]">
        <div :class="['city-search__input-wrapper', { 'result-valid': citiesSearchList !== null && citySearchQuery.length > 0 && citiesSearchList.length > 0 && inputFocused, 'result-invalid': citiesSearchList !== null && citySearchQuery.length > 0 && citiesSearchList.length === 0 && citySearchQuery.length > 0 && inputFocused }]">
            <input ref="citySearchInput" type="text" :class="['city-search__input', `${props.class}_input`]" placeholder="Поиск..." v-model="citySearchQuery" @input="searchInputChange" @focus="searchInputFocus" @keydown="inputKeyDown" @blur="inputBlur">
            <SearchIcon :class="`city-search__icon ${props.class}_icon`" />
            <DataLoader class="city-search__data-loader" :visible="isLoading" />
        </div>
        <transition name="fade-in">
            <div class="cities-search__dropdown" v-if="citiesSearchList !== null && inputFocused" @mouseleave="dropDownMouseLeave(); dropDownMousePressed = false" @mousedown="dropDownMousePressed = true" @mouseup="dropDownMousePressed = false">
                <p class="city-search__list_error" v-if="citiesSearchList.length === 0 && citySearchQuery.length > 0">Такого населенного пункта нет</p>
                <div class="city-search__list" v-if="citiesSearchList">
                    <div :class="['city-search__list_item', { 'active': citiesSearchList[idx].active }]" v-for="(item, idx) in citiesSearchList" :key="idx" @click="cityChoose(idx)" @mouseenter="dropDownItemHover(idx)">
                        <template v-if="item.properties.state.length>0">
                            {{ item.properties.city + ', ' + item.properties.state + ', ' + item.properties.country }}
                        </template>
                        <template v-else>
                            {{ item.properties.city + ', ' + item.properties.country }}
                        </template>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import SearchIcon from './Icons/SearchIcon.vue';
import { onMounted, ref } from 'vue';
import type { Ref, PropType } from 'vue'
import type city from '@/types/city'
import DataLoader from './DataLoader.vue';
import { useWeatherStore } from '@/stores/WeatherStore'
import { useCitiesHistoryStore } from '@/stores/CitiesHistoryStore'
import searchCityApi from '@/services/searchCityApi'
const WeatherStore = useWeatherStore()
const CitiesHistoryStore = useCitiesHistoryStore()
const citiesSearchList: Ref<city[] | null> = ref(null)
const citySearchInput: Ref<HTMLInputElement | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const inputFocused: Ref<boolean> = ref(false)
const citySearchQuery: Ref<string> = ref('')
const queryTimeOut: Ref<number | null> = ref(null)
const currentCityIdx: Ref<number | null> = ref(null)
const dropDownMousePressed = ref(false)
const inputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && citiesSearchList.value) {
        citiesSearchList.value.forEach((item, idx) => {
            if (item.active) {
                cityChoose(idx)
            }
        })
    }
    else {
        if (citiesSearchList.value && citiesSearchList.value.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                if (currentCityIdx.value === citiesSearchList.value.length - 1 || currentCityIdx.value === null) {
                    currentCityIdx.value = 0
                }
                else {
                    currentCityIdx.value++
                }
                citySearchQuery.value = citiesSearchList.value[currentCityIdx.value].properties.city
                citySearchInput.value ? citySearchInput.value.selectionStart = citySearchInput.value.selectionEnd = citySearchQuery.value.length:'';
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault()
                if (currentCityIdx.value === 0 || currentCityIdx.value === null) {
                    currentCityIdx.value = citiesSearchList.value.length - 1
                }
                else {
                    currentCityIdx.value--
                }
                citySearchQuery.value = citiesSearchList.value[currentCityIdx.value].properties.city
                citySearchInput.value ? citySearchInput.value.selectionStart = citySearchInput.value.selectionEnd = citySearchQuery.value.length:'';
            }
            citiesSearchList.value.forEach((item, idx) => {
                if (idx === currentCityIdx.value) {
                    item.active = true
                }
                else {
                    item.active = false
                }
            })
        }
    }
}
const dropDownItemHover = (id: number) => {
    if (citiesSearchList.value) {
        citiesSearchList.value.forEach((item, idx) => {
            if (idx === id) {
                item.active = true
                currentCityIdx.value = id
            }
            else {
                item.active = false
            }
        })
    }
}
const dropDownMouseLeave = () => {
    if (citiesSearchList.value) {
        citiesSearchList.value.forEach(item => {
            item.active = false
        })
    }
    currentCityIdx.value = null
}
const searchInputFocus = () => {
    if (citySearchQuery.value.length === 0 && CitiesHistoryStore.citiesList.length > 0) {
        citiesSearchList.value = CitiesHistoryStore.citiesList
    }
    inputFocused.value = true
}
const inputBlur = (e: FocusEvent) => {
    if (dropDownMousePressed.value && citySearchInput.value) {
        e.preventDefault();
        citySearchInput.value.focus()
    }
    else {
        currentCityIdx.value = null
        inputFocused.value = false
        if (citiesSearchList.value) {
            citiesSearchList.value.forEach(item => {
                item.active = false
            })
        }
    }
}
const searchInputChange = () => {
    if (citySearchQuery.value.length === 0) {
        citiesSearchList.value = CitiesHistoryStore.citiesList
    }
    if (queryTimeOut.value) {
        clearTimeout(queryTimeOut.value)
    }
    queryTimeOut.value = setTimeout(() => {
        if (citySearchQuery.value.length > 0) {
            searchCity()
        }
        else {
            if (CitiesHistoryStore.citiesList.length > 0) {
                citiesSearchList.value = CitiesHistoryStore.citiesList
            }
            else {
                citiesSearchList.value = null
            }
        }
    }, 300)
}
const cityChoose = (idx: number) => {
    if (citySearchInput.value && citiesSearchList.value) {
        getRegionForecast(idx)
        citySearchInput.value.blur()
        inputFocused.value = false
        citySearchQuery.value = ''
        CitiesHistoryStore.addCity(citiesSearchList.value[idx])
        citiesSearchList.value = null
    }
}
const searchCity = async () => {
    currentCityIdx.value = null
    isLoading.value = true
    const response = await searchCityApi(citySearchQuery.value)
    if (response !== null) {
        if(!(response instanceof Error)) {
            const table: any = {};
            citiesSearchList.value = response
            if (citiesSearchList.value !== null) {
                citiesSearchList.value = citiesSearchList.value.filter((item) => {
                    return item.properties.city && (!table[item.properties.state] && (table[item.properties.state] = 1))
                })
                citiesSearchList.value.forEach(item => {
                    if (item.properties.state === item.properties.city) {
                        item.properties.state = ''
                    }
                })
                console.log(citiesSearchList.value)
                if (citiesSearchList.value.length === 0) {
                    if (citySearchQuery.value.length === 0) {
                        citiesSearchList.value = null
                    }
                }
            }
        }
        else {
            citiesSearchList.value = null
            alert('Что-то пошло не так, попробуйте позже')
        }
        isLoading.value = false
    }
}
const getRegionForecast = async (id: number) => {
    if(citiesSearchList.value) {
        let currentRegionLat = citiesSearchList.value[id].properties.lat
        let currentRegionLon = citiesSearchList.value[id].properties.lon
        let currentCity = citiesSearchList.value[id].properties.city
        let currentCountry = citiesSearchList.value[id].properties.country
        if(WeatherStore.currentCityName === '') {
            WeatherStore.setCityName(`${currentCity}, ${currentCountry}`)
        }
        const result = await WeatherStore.getWeather(currentRegionLat, currentRegionLon)
        if(result === 'success') {
            WeatherStore.setCityName(`${currentCity}, ${currentCountry}`)
        }
    }
}
onMounted(() => {
    CitiesHistoryStore.getCitiesFromLS()
})
const props = defineProps({
    class: {
        type: String as PropType<string>,
        required: false
    }
})
</script>

<style lang="scss">
.city-search {
    position: relative;
    width: 100%;
    max-width: 900px;
    z-index: 10;
}
.city-search__input-wrapper {
    position: relative;
    width: 100%;
    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 1px;
        transform: scale(0, .5);
        transition: .3s ease;
    }
    &.result-valid::after {
        transform: scale(1);
        background: $green-color;
    }
    &.result-invalid::after {
        transform: scale(1);
        background: rgb(255, 56, 56);
    }
}
.city-search__input {
    display: block;
    width: 100%;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #FFFFFF;
    padding: 24px 25px 24px 60px;
    .dark-theme & {
        background: $dark-primary-color;
    }
    .light-theme & {
        background: $light-primary-color;
    }
    border-radius: 35px;
    transition: $base-transition;
    &::placeholder {
        color: inherit;
    }
    .dropdown-active & {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
}
.city-search__icon {
    position: absolute;
    top: 50%;
    left: 25px;
    transform: translate(0, -50%);
    pointer-events: none;
}
.city-search__data-loader {
    position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
}
.cities-search__dropdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(100%);
    z-index: -1;
    overflow: hidden;
    .dark-theme & {
        background: $dark-primary-color;
    }
    .light-theme & {
        background: $light-primary-color;
    }
    border-radius: 0 0 35px 35px;
    &.fade-in-enter-active,
    &.fade-in-leave-active {
        transition: opacity, transform, .3s ease;
    }

    &.fade-in-enter-from,
    &.fade-in-leave-to {
        opacity: 0;
        transform: translateY(110%);
    }
}
.city-search__list {
    width: 100%;
    max-height: 220px;
    z-index: -1;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: $dark-secondary-color $dark-primary-color;
    &::-webkit-scrollbar {
        width: 7px;
        background-color: $dark-primary-color;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        width: 3px;
        background-color: $dark-secondary-color;
        height: 20%;
    }
    .dark-theme & {
        scrollbar-color: $dark-secondary-color $dark-primary-color;
        scrollbar-width: thin;
        &::-webkit-scrollbar {
            background-color: $dark-primary-color;
        }
        &::-webkit-scrollbar-thumb {
            background-color: $dark-secondary-color;
        }
    }
    .light-theme & {
        scrollbar-color: $light-secondary-color $light-primary-color;
        &::-webkit-scrollbar {
            background-color: $light-primary-color;
        }
        &::-webkit-scrollbar-thumb {
            background-color: $light-secondary-color;
        }
    }
}
.city-search__list_item {
    padding: 15px 25px;
    cursor: pointer;
    transition: $base-transition;
    &.active {
        background: $dark-secondary-color;
        color: $dark-primary-color;
    }
}
.city-search__list_error {
    padding: 20px 25px;
}
@media (max-width:1400px) {
    .city-search {
        max-width: 800px;
    }
    .city-search__input {
        padding: 20px 20px 20px 50px;
    }
    .city-search__icon {
        left: 20px;
        max-width: 20px;
    }
    .city-search__list_item {
        font-size: 14px;
    }
}
@media (max-width:900px) {
    .city-search__list_item {
        font-size: 12px;
    }
}
@media (max-width:370px) {
    .city-search__list_error {
        font-size: 14px;
        padding: 14px 20px;
    }
}
</style>