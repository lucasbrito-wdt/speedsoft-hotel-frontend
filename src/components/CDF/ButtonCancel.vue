<script setup lang="ts">
interface Props {
  buttonText: string
  urlRedirect?: string
  color?: string
  icon?: string
  loading?: boolean
  disabled?: boolean
}
const props = defineProps < Props > ()
</script>

<template>
  <div>
    <VBtn
      :disabled="props.disabled || false"
      :color="props.color || 'secondary'"
      variant="tonal"
      :to="props.urlRedirect"
    >
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
        :icon="props.icon || 'tabler-x'"
        size="24"
        class="mr-2"
      />
      <span v-if="!props.loading">
        {{ props.buttonText }}
      </span>
    </VBtn>
  </div>
</template>
