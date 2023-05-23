<template>
    <div :class="['city-search', props.class, {'dropdown-active': citiesSearchList && inputFocused}]">
        <div :class="['city-search__input-wrapper', {'result-valid': citiesSearchList && !isSearchListEmpty && inputFocused, 'result-invalid':citiesSearchList && isSearchListEmpty && citySearchQuery.length>0 && inputFocused}]">
            <input ref="citySearchInput" type="text" :class="['city-search__input', `${props.class}_input`]" placeholder="Поиск..." v-model="citySearchQuery" @input="searchInputChange" @focus="inputFocused=true" @keydown="inputKeyDown" @blur="inputBlur">
            <SearchIcon :class="['city-search__icon', `${props.class}_icon`]" />
            <DataLoader class="city-search__data-loader" :visible="isLoading" />
        </div>
        <transition name="fade-in">
            <div class="city-search__list" v-if="citiesSearchList && inputFocused" @mouseleave="dropDownMouseLeave(); dropDownMousePressed = false" @mousedown="dropDownMousePressed = true" @mouseup="dropDownMousePressed = false">
                <p class="city-search__list_error" v-if="citiesSearchList.length === 0 && citySearchQuery.length>0">Такого населенного пункта нет</p>
                <template v-else>
                    <div :class="['city-search__list_item', {'active': citiesSearchList[idx].active}]" v-for="(item, idx) in citiesSearchList" :key="idx" @click="cityChoose(idx)" @mouseenter="dropDownItemHover(idx)">
                        <template v-if="item.properties.state">
                            {{ item.properties.city + ', ' + item.properties.state + ', ' + item.properties.country }}
                        </template>
                        <template v-else>
                            {{ item.properties.city + ', ' + item.properties.country }}
                        </template>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script setup>
import SearchIcon from './Icons/SearchIcon.vue';
import { ref } from 'vue';
import DataLoader from './DataLoader.vue';
import { useCurrentCityStore } from '@/stores/CurrentCityStore.js'
const CurrentCityStore = useCurrentCityStore()
const citiesSearchList = ref(null)
const isSearchListEmpty = ref(true)
const citySearchInput = ref(null)
const isLoading = ref(false)
const inputFocused = ref(false)
const citySearchQuery = ref('')
const queryTimeOut = ref(null)
const currentCityIdx = ref(null)
const dropDownMousePressed = ref(false)
const inputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (e.key === 'Enter') {
            citiesSearchList.value.forEach((item, idx) => {
                if (item.active) {
                    cityChoose(idx)
                }
            })
        }
        else {
            if (citiesSearchList.value && citiesSearchList.value.length > 0) {
                if (e.key === 'ArrowDown') {
                    if (currentCityIdx.value === citiesSearchList.value.length - 1 || currentCityIdx.value === null) {
                        currentCityIdx.value = 0
                    }
                    else {
                        currentCityIdx.value++
                    }
                }
                else if (e.key === 'ArrowUp') {
                    if (currentCityIdx.value === 0 || currentCityIdx.value === null) {
                        currentCityIdx.value = citiesSearchList.value.length - 1
                    }
                    else {
                        currentCityIdx.value--
                    }
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
}
const dropDownItemHover = (id) => {
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
const inputBlur = (e) => {
    if (dropDownMousePressed.value) {
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
    clearTimeout(queryTimeOut.value)
    queryTimeOut.value = setTimeout(() => {
        if (citySearchQuery.value.length > 0) {
            searchCity()
        }
        else {
            citiesSearchList.value = null
        }
    }, 300)
}
const cityChoose = (idx) => {
    getRegionForecast(idx)
    citySearchInput.value.blur()
    inputFocused.value = false
    citySearchQuery.value = ''
    citiesSearchList.value = null
    isSearchListEmpty.value = true
}
const searchCity = async () => {
    let apiKey = '800dd35af7b245af85b0701fa0cdd045'
    let limit = 5
    currentCityIdx.value = null
    isLoading.value = true
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${citySearchQuery.value}&lang=ru&limit=${limit}&type=city&apiKey=${apiKey}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw new Error('Something went wrong');
        })
        .then((response) => {
            const table = {};
            citiesSearchList.value = response.features
            citiesSearchList.value = citiesSearchList.value.filter((item) => {
                return item.properties.city && (!table[item.properties.state] && (table[item.properties.state] = 1))
            })
            citiesSearchList.value.forEach(item => {
                if (item.properties.state === item.properties.city) {
                    item.properties.state = null
                }
            })
            console.log(citiesSearchList.value)
            isLoading.value = false
        })
        .then(() => {
            if (citiesSearchList.value.length === 0) {
                if (citySearchQuery.value.length === 0) {
                    citiesSearchList.value = null
                }
                isSearchListEmpty.value = true
            }
            else {
                isSearchListEmpty.value = false
            }
        })
        .catch((error) => {
            console.log(error)
        });
}
const getRegionForecast = (id) => {
    let currentRegionLat = citiesSearchList.value[id].properties.lat
    let currentRegionLon = citiesSearchList.value[id].properties.lon
    let currentCity = citiesSearchList.value[id].properties.city
    let currentCountry = citiesSearchList.value[id].properties.country
    CurrentCityStore.setCity(`${currentCity}, ${currentCountry}`)
    CurrentCityStore.getWeather(currentRegionLat, currentRegionLon)
}
const props = defineProps({
    class: {
        type: String,
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
.city-search__list {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(100%);
    .dark-theme & {
        background: $dark-primary-color;
    }
    .light-theme & {
        background: $light-primary-color;
    }
    border-radius: 0 0 35px 35px;
    z-index: -1;
    max-height: 220px;
    overflow: auto;
    scrollbar-color: $dark-secondary-color $dark-primary-color;
    scrollbar-width: thin;
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