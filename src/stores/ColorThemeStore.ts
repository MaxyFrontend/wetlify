import { defineStore } from 'pinia'
interface state {
    themes: {
        light: {
            icon: string,
            choosen: boolean
        },
        dark: {
            icon: string,
            choosen: boolean
        }
    }
}
export const useColorThemeStore = defineStore('ColorThemeStore', {
    state: ():state => {
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
        switchToLight():void {
            this.themes.light.choosen = true
            this.themes.dark.choosen = false
            localStorage.setItem('theme', 'light')
        },
        switchToDark():void {
            this.themes.dark.choosen = true
            this.themes.light.choosen = false
            localStorage.setItem('theme', 'dark')
        },
        getThemeFromLS():void {
            const theme: string | null = localStorage.getItem('theme')
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