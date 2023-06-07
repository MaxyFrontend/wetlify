<template>
    <div :class="['logo', props.class]">
        <img src="@/assets/img/logo.svg" alt="logo" :class="['logo__image', `${props.class}_image`]">
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        class: {
            type:String,
            required:false
        }
    })
</script>

<style lang="scss">
    
</style>