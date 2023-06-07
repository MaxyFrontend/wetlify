<template>
    <div :class="['loader', props.class]" v-if="props.visible">

    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    colors: {
        type: Array,
        required: false,
    },
    class: {
        type: String,
        required: false,
    },
    visible: {
        type:Boolean,
        required:false,
        default:false
    }
})
</script>

<style lang="scss">
.loader {
    position: relative;
    display: inline-block;
    width: 21px;
    height: 21px;
    &::before,
    &::after {
        display: block;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-width: 2px;
        border-style: solid;
        border-radius: 50%;
        border-color: #323232;
    }
    &::after {
        animation: loader .5s linear infinite;
        border-right-color: $green-color;
    }
    &::before {
        border-color: $dark-background-color;
    }
}
@keyframes loader {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>