<template>
    <div class="forecast-screen" v-if="WeatherStore.weatherLoading !== null">
        <div class="container forecast-screen__container">
            <div class="current-weather" v-if="currentWeather && !WeatherStore.weatherLoading">
                <div class="current-weather__content">
                    <div class="current-weather__left-col current-weather__col">
                        <div class="current-weather__temp">
                            {{ currentWeather.main.temp + '°C' }}
                        </div>
                        <div class="current-weather__temp-feels current-weather__left-col_item">
                            {{ 'Ощущается как ' + currentWeather.main.feels_like + '°C' }}
                        </div>
                        <div class="current-weather__description current-weather__left-col_item">
                            {{ currentWeather.weather[0].description }}
                        </div>
                        <div class="current-weather__pressure current-weather__left-col_item">
                            {{ currentWeather.main.pressure + ' мм рт. ст.' }}
                        </div>
                    </div>
                    <div class="current-weather__right-col current-weather__col">
                        <img class="current-weather__icon" :src="currentWeather.weather[0].icon" :alt="currentWeather.weather[0].description">
                        <div class="current-weather__humidity current-weather__right-col_item">
                            {{ 'Влажность ' + currentWeather.main.humidity+'%' }}
                        </div>
                    </div>
                </div>
                <p class="current-weather__date">Сегодня</p>
            </div>
            <content-loader class="loading-skeleton current-weather-skeleton" v-if="WeatherStore.weatherLoading === true"
                width="100%"
                height="240"
                :speed="1.5"
                :primaryColor="contentLoaderPrimaryColor"
                :secondaryColor="contentLoaderSecondaryColor">
                <rect class="current-weather-skeleton__placeholder current-weather-skeleton__temp-feels" x="0" y="74" rx="3" ry="3" width="100" height="6" />
                <rect class="current-weather-skeleton__placeholder current-weather-skeleton__description" x="0" y="99" rx="3" ry="3" width="170" height="6" />
                <rect class="current-weather-skeleton__placeholder current-weather-skeleton__pressure" x="0" y="124" rx="3" ry="3" width="130" height="6" />
                <rect class="current-weather-skeleton__placeholder current-weather-skeleton__humidity" x="90%" y="154" rx="3" ry="3" width="130" height="6" />
                <circle class="current-weather-skeleton__circle" cx="90%" cy="69" r="79" />
                <text x="0" y="54" class="current-weather-skeleton__text">*°C</text>
                <rect class="current-weather-skeleton__placeholder current-weather-skeleton__date" x="0" y="164" rx="3" ry="3" width="100" height="6" />
            </content-loader>
            <div class="daily-weather" v-if="dailyWeather && WeatherStore.weatherLoading === false">
                <div class="daily-weather__item" v-for="(item, idx) in WeatherStore.dailyWeather" :key="idx">
                    <div class="daily-weather__item_left-col">
                        <p class="daily-weather__item_date daily-weather__item_param">{{ item.date }}</p>
                        <div class="daily-weather__item_temp daily-weather__item_param">
                            {{ item.main.temp + '°C' }}
                        </div>
                        <div class="daily-weather__item_temp-feels daily-weather__item_param">
                            {{ 'Ощущается как ' + item.main.feels_like + '°C' }}
                        </div>
                        <div class="daily-weather__item_description daily-weather__item_param">
                            {{ item.weather[0].description }}
                        </div>
                        <div class="daily-weather__item_humidity daily-weather__item_param">
                            {{ 'Влажность '+item.main.humidity+'%' }}
                        </div>
                        <div class="daily-weather__item_description daily-weather__item_param">
                            {{ item.main.pressure + ' мм рт. ст.' }}
                        </div>
                    </div>
                    <img class="daily-weather__item_icon" :src="item.weather[0].icon" :alt="item.weather[0].description" />
                </div>
            </div>
            <content-loader class="loading-skeleton daily-weather-skeleton desktop-daily-weather-skeleton" v-if="WeatherStore.weatherLoading === true"
                viewBox="0 0 1600 220"
                :speed="1.5"
                :primaryColor="contentLoaderPrimaryColor"
                :secondaryColor="contentLoaderSecondaryColor">
                <rect x="0" y="0" rx="25" ry="35" width="18%" height="100%" />
                <rect x="20.5%" y="0" rx="25" ry="35" width="18%" height="100%" />
                <rect x="41%" y="0" rx="25" ry="35" width="18%" height="100%" />
                <rect x="62%" y="0" rx="25" ry="35" width="18%" height="100%" />
                <rect x="82%" y="0" rx="25" ry="35" width="18%" height="100%" />
            </content-loader>
            <content-loader class="loading-skeleton daily-weather-skeleton mobile-daily-weather-skeleton" v-if="WeatherStore.weatherLoading === true"
                viewBox="0 0 1000 590"
                :speed="1.5"
                :primaryColor="contentLoaderPrimaryColor"
                :secondaryColor="contentLoaderSecondaryColor"
                preserveAspectRatio="none">
                <rect x="0" y="0" rx="0" ry="20px" width="48%" height="180" />
                <rect x="52%" y="0" rx="0" ry="20px" width="48%" height="180" />
                <rect x="0" y="200" rx="0" ry="20px" width="48%" height="180" />
                <rect x="52%" y="200" rx="0" ry="20px" width="48%" height="180" />
                <rect x="0" y="400" rx="0" ry="20px" width="48%" height="180" />
            </content-loader>
        </div>
    </div>
</template>

<script setup>
import { useWeatherStore } from '@/stores/WeatherStore'
import { computed } from 'vue';
import { ContentLoader } from 'vue-content-loader'
import { useColorThemeStore } from '@/stores/ColorThemeStore'
const ColorThemeStore = useColorThemeStore()
const WeatherStore = useWeatherStore()
const currentWeather = computed(() => {
    return WeatherStore.currentWeather
})
const dailyWeather = computed(() => {
    return WeatherStore.dailyWeather
})
console.log(currentWeather)
const contentLoaderPrimaryColor = computed(() => {
    const getValue = () => {
        if (ColorThemeStore.themes.light.choosen) {
            return '#1b578f'
        }
        else if (ColorThemeStore.themes.dark.choosen) {
            return '#1A1A22'
        }
    }
    return getValue()
})
const contentLoaderSecondaryColor = computed(() => {
    const getValue = () => {
        if (ColorThemeStore.themes.light.choosen) {
            return '#fefefe'
        }
        else if (ColorThemeStore.themes.dark.choosen) {
            return '#797979'
        }
    }
    return getValue()
})
</script>

<style lang="scss">
.forecast-screen {
    padding: 0px 0 40px;
}
.current-weather {
    padding-top: 40px;
    margin-bottom: 100px;
    min-height: 250px;
}
.current-weather__content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
.current-weather__temp {
    font-weight: 500;
    font-size: 64px;
    line-height: 1;
    margin-bottom: 30px;
}
.current-weather__left-col_item {
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 14px;
    &:last-child {
        margin-bottom: 0;
    }
}
.current-weather__date {
    font-size: 24px;
    line-height: 30px;
    font-weight: 500;
}
.current-weather__icon {
    max-width: 250px;
    height: 170px;
    object-fit: contain;
    margin-bottom: 20px;
}
.current-weather__right-col_item {
    display: flex;
    justify-content: center;
}
.loading-skeleton {
    width: 100%;
}
.current-weather-skeleton {
    height: 300px;
    padding-top: 40px;
    margin-bottom: 80px;
    width: 100%;
    & .current-weather-skeleton__placeholder {
        transition: 0.2s ease;
    }
    & .current-weather-skeleton__text {
        font-family: 'Montserrat';
        font-weight: 500;
        font-size: 64px;
        line-height: 1;
    }
    & .current-weather-skeleton__circle {
        r: 79px;
        cx: calc(100% - 99px);
        cy: 79px;
    }
    & .current-weather-skeleton__humidity {
        x: calc(100% - 144px);
        width: 89px;
        y: 174px;
    }
}
.daily-weather {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 40px;
}
.daily-weather__item {
    position: relative;
    display: flex;
    flex-direction: column;
    transition: background 0.2s ease;
    .dark-theme & {
        background: $dark-primary-color;
    }
    .light-theme & {
        background: $light-primary-color;
    }
    border-radius: 25px;
    padding: 25px;
    &:last-child {
        margin-right: 0;
    }
}
.daily-weather__item_param {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 5px;
    &:last-child {
        margin-bottom: 0;
    }
}
.daily-weather__item_date {
    font-size: 16px;
    margin-bottom: 10px;
}
.daily-weather__item_temp {
    font-size: 20px;
    line-height: 26px;
    margin-bottom: 10px;
}
.daily-weather__item_icon {
    position: absolute;
    right: 20px;
    top: 15px;
    max-width: 50px;
    min-height: 50px;
    object-fit: contain;
}
.desktop-daily-weather-skeleton {
    display: block;
}
.mobile-daily-weather-skeleton {
    display: none;
    height: 590px;
}
@media (max-width:1600px) {
    .current-weather {
        margin-bottom: 60px;
    }
    .current-weather-skeleton {
        margin-bottom: 60px;
    }
    .current-weather__temp {
        font-size: 58px;
    }
    .current-weather-skeleton {
        margin-bottom: 60px;
        & .current-weather-skeleton__text {
            font-family: 'Montserrat';
            font-weight: 500;
            font-size: 58px;
            line-height: 1;
        }
        & .current-weather-skeleton__circle {
            r: 69px;
            cx: calc(100% - 69px);
        }
        & .current-weather-skeleton__humidity {
            x: calc(100% - 109px);
            y: 164px;
        }
    }
    .daily-weather {
        grid-gap: 25px;
    }
}
@media (max-width:1400px) {
    .current-weather {
        padding-top: 20px;
        margin-bottom: 50px;
    }
    .current-weather-skeleton {
        margin-bottom: 50px;
        max-height: 240px;
    }
    .current-weather__temp {
        font-size: 54px;
    }
    .current-weather__left-col_item {
        font-size: 14px;
        line-height: 18px;
    }
    .current-weather__right-col_item {
        font-size: 14px;
        line-height: 18px;
    }
    .current-weather__date {
        font-size: 20px;
        line-height: 26px;
    }
    .daily-weather {
        grid-gap: 15px;
    }
    .daily-weather__item {
        padding: 20px;
    }
    .daily-weather__item_param {
        font-size: 12px;
        line-height: 18px;
    }
}
@media (max-width:1200px) {
    .current-weather__temp {
        font-size: 50px;
    }
}
@media (max-width:900px) {
    .forecast-screen {
        padding-top: 0;
    }
    .current-weather__icon {
        max-width: 200px;
        height: 130px;
        margin-bottom: 10px;
    }
    .current-weather__temp {
        font-size: 44px;
    }
    .current-weather__left-col_item {
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 12px;
    }
    .current-weather__right-col_item {
        font-size: 12px;
        line-height: 16px;
    }
    .current-weather__date {
        margin-top: 20px;
    }
    .current-weather-skeleton {
        margin-bottom: 80px;
        & .current-weather-skeleton__text {
            font-family: 'Montserrat';
            font-weight: 500;
            font-size: 50px;
            line-height: 1;
        }
    }
}
@media (max-width:800px) {
    .daily-weather {
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .desktop-daily-weather-skeleton {
        display: none;
    }
    .mobile-daily-weather-skeleton {
        display: block;
    }
}
@media (max-width:550px) {
    .current-weather {
        padding-top: 30px;
        min-height: auto;
    }
    .current-weather-skeleton {
        max-height: 220px;
        padding-top: 30px;
    }
    .current-weather__temp {
        font-size: 40px;
        margin-bottom: 20px;
    }
    .current-weather__icon {
        max-width: 150px;
        height: auto;
        max-height: 130px;
    }
    .daily-weather__item {
        padding: 14px 16px;
        border-radius: 14px;
    }
    .daily-weather__item_icon {
        right: 10px;
        top: 10px;
    }
    .current-weather-skeleton {
        margin-bottom: 30px;
        & .current-weather-skeleton__text {
            font-family: 'Montserrat';
            font-weight: 500;
            font-size: 40px;
            line-height: 1;
        }
        & .current-weather-skeleton__circle {
            r: 59px;
            cx: calc(100% - 59px);
        }
        & .current-weather-skeleton__humidity {
            x: calc(100% - 104px);
            y: 154px;
        }
    }
}
@media (max-width:400px) {
    .current-weather-skeleton {
        & .current-weather-skeleton__circle {
            r: 49px !important;
            cx: calc(100% - 49px) !important;
        }
        & .current-weather-skeleton__humidity {
            width: 69px;
            x: calc(100% - 84px);
            y: 144px;
        }
    }
    .daily-weather {
        grid-gap: 8px;
    }
}
@media (max-width:370px) {
    .current-weather__temp {
        font-size: 32px;
    }
    .current-weather__left-col_item {
        margin-bottom: 10px;
    }
    .current-weather__icon {
        max-width: 130px;
        height: auto;
        max-height: 110px;
    }
    .current-weather-skeleton__temp-feels {
        width: 90px;
    }
    .current-weather-skeleton__description {
        width: 140px;
    }
    .current-weather-skeleton__pressure {
        width: 110px;
    }
    .daily-weather {
        grid-template-columns: 1fr;
    }
    .daily-weather__item {
        padding: 16px;
    }
}
</style>