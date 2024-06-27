<script setup lang="ts">
interface Props {
  isLoaderVisible: boolean
  text?: string
  isPersistent?: boolean
}

interface Emit {
  (e: 'update:isLoaderVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
  (e: 'cancel', value: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()
const loaderVisible = ref(props.isLoaderVisible)

const updateModelValue = (val: boolean) => {
  emit('update:isLoaderVisible', val)
}

watch(loaderVisible, value => {
  if (!value)
    return

  setTimeout(() => {
    updateModelValue(false)
  }, 7000)
})
</script>

<template>
  <VDialog
    max-width="300"
    :persistent="isPersistent"
    :model-value="props.isLoaderVisible"
    @update:model-value="updateModelValue"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3">
        {{ props.text }}
        <VProgressLinear
          indeterminate
          class="mb-0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
