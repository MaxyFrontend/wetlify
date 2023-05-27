
<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { useWeatherStore } from '@/stores/WeatherStore'
import StartScreen from '../components/StartScreen.vue'
import ForecastScreen from '../components/ForecastScreen.vue'
const WeatherStore = useWeatherStore()
</script>
<template>
  <AppHeader :class="[{'forecast-screen__header': WeatherStore.currentWeatherLoading !== null}]" />
  <main class="main">
    <StartScreen />
    <ForecastScreen />
  </main>
</template>
<style lang="scss">
.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>