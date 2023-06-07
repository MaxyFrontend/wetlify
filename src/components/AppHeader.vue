<template>
    <header :class="['header', {'forecast-screen__header': WeatherStore.weatherLoading !== null}]">
        <div class="container header__container">
            <AppLogo class="header__logo" />
            <GetCurrentLocationBtn class="header__get-location-btn" v-if="WeatherStore.weatherLoading === null" />
            <div class="header__location-inner" v-if="WeatherStore.weatherLoading !== null">
                <div class="current-location header__current-location">
                    <LocationIcon :class="['current-location__icon']" />
                    <p class="current-location__value"> {{ WeatherStore.currentCityName }} </p>
                </div>
                <CitySearch class="header__city-search" />
            </div>
            <ThemeSwitcher class="header__theme-switcher" />
        </div>
    </header>
</template>

<script setup lang="ts">
import GetCurrentLocationBtn from './getCurrentLocationBtn.vue'
import AppLogo from '@/components/AppLogo.vue'
import LocationIcon from './Icons/LocationIcon.vue'
import CitySearch from './CitySearch.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
import { useWeatherStore } from '@/stores/WeatherStore'
const WeatherStore = useWeatherStore()
</script>

<style lang="scss">
.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 40px 0;
}
.forecast-screen__header {
    position: static;
}
.header__container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.header__get-location-btn {
    margin-left: 50px;
}
.header__location-inner {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 50px;
}
.header__current-location {
    margin-right: 50px;
}
.header__city-search {
    &.city-search {
        flex-basis: 70%;
        max-width: 750px;
    }
}
.header__city-search_input {
    padding: 21px 25px 21px 60px;
}
.header__theme-switcher {
    margin-left: auto;
}
@media (max-width:1600px) {
    .header {
        padding: 30px 0;
    }
    .header__get-location-btn {
        margin-left: 40px;
    }
    .header__current-location {
        & .current-location__value {
            font-size: 16px;
        }
    }
}
@media (max-width:1400px) {
    .header__location-inner {
        margin: 0 30px;
    }
    .header__current-location {
        & .current-location__value {
            font-size: 14px;
        }
    }
    .header__city-search_input {
        padding: 20px 20px 20px 50px;
    }
    .header__theme-switcher {
        & .theme-switcher__item_icon {
            max-width: 24px;
        }
    }
}
@media (max-width:1200px) {
    .header__get-location-btn {
        margin-left: 30px;
    }
    .header__location-inner {
        margin: 0 20px;
    }
    .header__city-search {
        &.city-search {
            flex: 1 1 60%;
        }
    }
    .header__current-location {
        margin-right: 30px;
    }
}
@media (max-width:900px) {
    .header__logo {
        max-width: 170px;
    }
    .header__current-location {
        max-width: 250px;
    }
    .header__location-inner {
        width: 100%;
        order: 1;
        margin: 30px 0 0;
        flex-direction: column;
        align-items: flex-start;
    }
    .header__city-search.city-search {
        flex-basis: 100%;
    }
    .header__current-location {
        margin: 0 0 20px;
    }
    .header__theme-switcher {
        min-height: 45px;
        max-width: 90px;
        & .theme-switcher__item_icon {
            max-width: 18px;
        }
    }
}
@media (max-width:700px) {
    .header__get-location-btn {
        display: none;
    }
}
@media (max-width:370px) {
    .header__city-search_input {
        padding: 16px 20px 16px 50px;
    }
}
</style>