<script setup lang="ts">
interface Props {
  buttonText: string
  loading: boolean
  icon?: string
  disabledBtn?: boolean

}
const props = defineProps<Props>()
</script>

<template lang="">
  <VBtn :disabled="props.disabledBtn">
    <VProgressCircular
      v-if="props.loading"
      :width="3"
      size="24"
      color="white"
      class="ml-2"
      indeterminate
    />
    <VIcon
      v-if="!props.loading"
      :icon="props.icon || 'tabler-device-floppy'"
      size="24"
      class="mr-2"
    />
    <span v-if="!props.loading">
      {{ props.buttonText }}
    </span>
  </VBtn>
</template>
