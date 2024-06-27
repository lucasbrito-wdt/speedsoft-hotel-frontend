<script lang="ts" setup>
interface Props {
  buttonIcon?: string
  buttonTextTooltip: string
  color?: string
}
const props = defineProps<Props>()
</script>

<template>
  <VBtn
    v-bind="props"
    :color="props.color || 'success'"
    variant="tonal"
    size="small"
    class="rounded mr-1"
  >
    <VIcon
      size="18"
      :icon="props.buttonIcon || 'tabler-check'"
    />

    <VTooltip
      activator="parent"
      location="end"
    >
      {{ props.buttonTextTooltip }}
    </VTooltip>
  </VBtn>
</template>
