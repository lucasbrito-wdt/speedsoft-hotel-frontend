<script setup lang="ts">
import { useConfigStore } from '@core/stores/config'
import type { ThemeSwitcherTheme } from '@layouts/types'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const configStore = useConfigStore()

const selectedItem = ref([configStore.theme])

// Update icon if theme is changed from other sources
watch(
  () => configStore.theme,
  () => {
    selectedItem.value = [configStore.theme]
  },
  { deep: true },
)
</script>

<template>
  <IconBtn color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
    <VIcon
      :icon="props.themes.find(t => t.name === configStore.theme)?.icon"
      size="24"
      @click="() => {
        configStore.theme = configStore.theme === 'dark' ? 'light' : 'dark'
      }"
    />

    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span class="text-capitalize">{{ configStore.theme }}</span>
    </VTooltip>
  </IconBtn>
</template>
