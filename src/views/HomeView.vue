
<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { useCurrentCityStore } from '@/stores/CurrentCityStore'
import StartScreen from '../components/StartScreen.vue'
import ForecastScreen from '../components/ForecastScreen.vue'
const CurrentCityStore = useCurrentCityStore()
</script>
<template>
  <AppHeader :class="[{'forecast-screen__header': CurrentCityStore.currentWeatherLoading !== null}]" />
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