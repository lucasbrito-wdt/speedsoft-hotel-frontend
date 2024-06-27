<script setup lang="ts">
import type { ColorButton } from '@/components/CDF/CDFButton.vue'
import CDFButton from '@/components/CDF/CDFButton.vue'

defineProps<{
  icon?: string
  to?: string
  color?: ColorButton
}>()
</script>

<template>
  <CDFButton
    is-icon
    rounded="xl"
    density="compact"
    :icon="icon"
    variant="outlined"
    :to="to"
    :color="color"
  />
</template>
