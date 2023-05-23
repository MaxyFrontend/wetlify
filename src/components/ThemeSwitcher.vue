<template>
    <div :class="['theme-switcher', props.class, {'light-mode':themeModes.light.choosen},{'dark-mode':themeModes.dark.choosen}]">
        <button type="button" :class="['theme-switcher__item', {'choosen': mode.choosen}]" v-for="(mode, current) in themeModes" :key="current" @click="chooseTheme(current)">
            <SunIcon class="theme-switcher__item_icon" v-if="mode.icon === 'SunIcon'" />
            <MoonIcon class="theme-switcher__item_icon" v-else />
        </button>
    </div>
</template>

<script setup>
import SunIcon from "./Icons/SunIcon.vue";
import MoonIcon from "./Icons/MoonIcon.vue";
import { reactive } from 'vue';
import { useColorThemeStore } from '@/stores/ColorThemeStore'
const ColorThemeStore = useColorThemeStore()
const themeModes = reactive(ColorThemeStore.themes)
const chooseTheme = (currentMode) => {
    if (currentMode === 'light') {
        ColorThemeStore.switchToLight()
    }
    else if (currentMode === 'dark') {
        ColorThemeStore.switchToDark()
    }
}
ColorThemeStore.getThemeFromLS()
const props = defineProps({
    class: {
        type: String,
        required: false
    }
})
</script>

<style lang="scss">
.theme-switcher {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 120px;
    min-height: 60px;
    transition: $base-transition;
    .dark-theme & {
        background: $dark-primary-color;
    }
    .light-theme & {
        background: $light-primary-color;
    }
    border-radius: 35px;
    z-index: 10;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 50%;
        height: 100%;
        border-radius: 35px;
        .dark-theme & {
            background: $dark-secondary-color;
        }
        .light-theme & {
            background: $light-secondary-color;
        }
        z-index: -1;
        will-change: transform;
        transition: .25s ease;
    }
    &.light-mode::before {
        transform: translateX(-100%);
    }
    &.dark-mode::before {
        transform: translateX(0);
    }
}
.theme-switcher__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    border-radius: 50%;
    flex-basis: 50%;
    background: transparent;
    cursor: pointer;
    transition: $base-transition;
    & path {
        transition: $base-transition;
    }
    .light-theme & path {
        fill: #fff;
    }
    .dark-theme & path {
        fill: #323232;
    }
    &.choosen {
        & .theme-switcher__item_icon {
            .light-theme & path {
                fill: $light-primary-color;
            }
            .dark-theme & path {
                fill: $dark-primary-color;
            }
        }
    }
}
</style>