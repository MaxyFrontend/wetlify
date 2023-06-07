<template>
    <section class="start-screen" v-if="WeatherStore.weatherLoading === null">
        <div class="container start-screen__container">
            <div class="start-screen__content">
                <h1 class="start-screen__title">Добро пожаловать на wetlify</h1>
                <h3 class="start-screen__search-title">
                    Найдите ваш населенный пункт
                </h3>
                <CitySearch class="start-screen__city-search" />
                <GetCurrentLocationBtn class="start-screen__get-location-btn" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import CitySearch from "./CitySearch.vue";
import { useWeatherStore } from '@/stores/WeatherStore'
import GetCurrentLocationBtn from './getCurrentLocationBtn.vue'
const WeatherStore = useWeatherStore()
</script>

<style lang="scss">
.start-screen {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 140px 0;
}
.start-screen__content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.start-screen__title {
    font-weight: 700;
    font-size: 52px;
    line-height: 63px;
    text-align: center;
    margin: 0 auto 50px;
}
.start-screen__search-title {
    font-weight: 400;
    font-size: 26px;
    line-height: 32px;
    text-align: center;
    color: #FFFFFF;
    margin: 0 auto 40px;
}
.start-screen__get-location-btn {
    display: none;
}
@media (max-width:1600px) {
    .start-screen__title {
        font-size: 46px;
        line-height: 57px;
        margin-bottom: 40px;
    }
    .start-screen__search-title {
        font-size: 24px;
        line-height: 30px;
    }
}
@media (max-width:1400px) {
    .start-screen__title {
        font-size: 42px;
        line-height: 53px;
        margin-bottom: 30px;
    }
    .start-screen__search-title {
        font-size: 20px;
        line-height: 26px;
    }
}
@media (max-width:1200px) {
    .start-screen__title {
        font-size: 38px;
        line-height: 48px;
    }
    .start-screen__search-title {
        font-size: 18px;
        line-height: 24px;
    }
}
@media (max-width:1000px) {
    .start-screen__title {
        font-size: 34px;
        line-height: 44px;
        margin-bottom: 20px;
    }
    .start-screen__search-title {
        font-size: 16px;
        line-height: 22px;
    }
}
@media (max-width:700px) {
    .start-screen__title {
        font-size: 30px;
        line-height: 40px;
    }
    .start-screen__search-title {
        font-size: 16px;
        line-height: 22px;
    }
    .start-screen__get-location-btn {
        display: flex;
        flex-direction: column;
        margin-top: 40px;
        & .get-current-location_btn_text {
            margin-top: 20px;
            margin-left: 0;
        }
    }
}
@media (max-width:370px) {
    .start-screen__title {
        font-size: 26px;
        line-height: 36px;
    }
    .start-screen__search-title {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 30px;
    }
}
</style>