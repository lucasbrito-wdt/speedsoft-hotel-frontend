<script setup lang="ts">
interface Props {
  title: string
  description?: string
  isDialogVisible: boolean
  actions?: boolean
  actionButtonText?: string
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
  (e: 'cancel', value: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="mb-4"
          style="width: 88px; height: 88px; pointer-events: none;"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          {{ props.title }}
        </h6>
        <p v-if="props.description">
          {{ props.description }}
        </p>
      </VCardText>
      <VCardActions v-if="props.actions">
        <VBtn @click="updateModelValue(false)">
          {{ props.actionButtonText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
