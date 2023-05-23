<template>
    <div :class="['content-loader', props.class]">
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    class: {
        type: String,
        required: false
    }
})
</script>

<style lang="scss">
$animation-duration: 1.5s;
$base-color: transparent;
$shine-color: #797979;
$gradient-offset: 52 + 16;
.content-loader {}
.content-loader__placeholder {
    position: relative;
    background-image: linear-gradient(90deg, $base-color, $shine-color 50%, $base-color 100%);
    background-repeat: no-repeat;
    background-size: 40px;
    overflow: hidden;
    animation: shine $animation-duration infinite linear;
    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
    }
}
@keyframes shine {
    0% {
        background-position: -100%;
    }
    100% {
        background-position: 100% + 20;
    }
}
</style>