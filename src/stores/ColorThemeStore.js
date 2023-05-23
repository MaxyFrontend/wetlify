import { defineStore } from 'pinia'
export const useColorThemeStore = defineStore('ColorThemeStore', {
    state: () => {
        return {
            themes: {
                light: {
                    icon: 'SunIcon',
                    choosen: false
                },
                dark: {
                    icon: 'MoonIcon',
                    choosen: true
                }
            }
        }
    },
    actions: {
        switchToLight() {
            this.themes.light.choosen = true
            this.themes.dark.choosen = false
            localStorage.setItem('theme', 'light')
        },
        switchToDark() {
            this.themes.dark.choosen = true
            this.themes.light.choosen = false
            localStorage.setItem('theme', 'dark')
        },
        getThemeFromLS() {
            let theme = localStorage.getItem('theme')
            if(theme) {
                if(theme === 'light') {
                    this.themes.light.choosen = true
                    this.themes.dark.choosen = false
                }
                else if(theme === 'dark') {
                    this.themes.light.choosen = false
                    this.themes.dark.choosen = true
                }
            }
        }
    },
})