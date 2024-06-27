<script setup lang="ts">
type VariantButton = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
type ColorButton = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary'
type StringOrNumber = string | number

interface Props {
  loading?: boolean
  icon: string
  variant: VariantButton
  color: ColorButton
  tooltipText: string
  size?: StringOrNumber
  additionalProp?: any
}
interface Emit {
  (e: 'clicked', value: any): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const emitGenericEvent = () => {
  emit('clicked', props.additionalProp)
}
</script>

<template>
  <div>
    <VBtn
      icon
      :color="props.color"
      :variant="props.variant"
      :size="props.size"
      class="rounded"
      @click="emitGenericEvent"
    >
      <VTooltip
        location="top"
        activator="parent"
      >
        {{ props.tooltipText }}
      </VTooltip>
      <VProgressCircular
        v-if="props.loading"
        :width="3"
        size="24"
        color="white"
        indeterminate
      />
      <VIcon
        v-if="!props.loading"
        size="18"
        :icon="props.icon"
      />
    </VBtn>
  </div>
</template>
