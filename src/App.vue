<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useColorThemeStore } from '@/stores/ColorThemeStore'
const ColorThemeStore = useColorThemeStore()
const colorTheme = computed(()=>{
  if(ColorThemeStore.themes.dark.choosen) {
    document.querySelector('html').style.background = '#1F1F2C'
    return 'dark'
  }
  else {
    document.querySelector('html').style.background = '#2270b9'
    return 'light'
  }
})
</script>

<template>
  <div :class="['app-wrapper', {'dark-theme': colorTheme === 'dark'}, {'light-theme': colorTheme === 'light'}]">
    <RouterView />
  </div>
</template>

<style src="@/assets/scss/main.scss">

</style>
<style lang="scss">
.app-wrapper {
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: background 0.2s ease;
  &.dark-theme {
    background: $dark-background-color;
  }
  &.light-theme {
    background: $light-background-color;
  }
}
</style>
