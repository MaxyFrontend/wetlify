<template>
    <svg :class="['moon-icon', props.class]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.51992 0.134167C8.74131 -0.41361 9.79946 0.82379 9.41735 1.89817C8.12085 5.5437 8.91743 9.68421 11.6086 12.3765C14.3134 15.0826 18.4778 15.878 22.1321 14.5571C23.1954 14.1728 24.3982 15.2214 23.8726 16.4147C23.857 16.45 23.8413 16.4851 23.8255 16.5204C22.8899 18.5969 21.3932 20.5497 19.4569 21.8589C17.393 23.2544 14.9591 24 12.4682 24H12.467C9.57035 23.9969 6.76496 22.9857 4.53174 21.1399C2.29851 19.2941 0.776517 16.7285 0.226796 13.8829C-0.322925 11.0373 0.133884 8.08908 1.51888 5.54357C2.83185 3.13041 5.03969 1.25513 7.48401 0.150328L7.51992 0.134167Z" :fill="props.color" />
    </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
    class: {
        type: String as PropType<string>,
        required: false,
    },
    color: {
        type: String as PropType<string>,
        required: false,
        default: '#323232'
    }
})
</script>

<style lang="scss">

</style>