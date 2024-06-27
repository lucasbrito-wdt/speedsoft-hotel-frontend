<script setup lang="ts">
const props = defineProps<{
  isDialogVisible: boolean
  item: object
  keyDestroy: string
  confirmButtonText: string
  cancelButtonText: string
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
  (e: 'cancel', value: boolean): void
}>()

const keyConfirm = ref<string>('')

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const onCancel = () => {
  emit('cancel', true)
  updateModelValue(false)
}
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="isDialogVisible"
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
          Informe o nome "{{ item[keyDestroy] }}" para confirmar a exclusão?
        </h6>

        <AppTextField
          v-model="keyConfirm"
          placeholder="Insira o nome para exclusão"
        />
      </VCardText>

      <VCardActions class="align-center justify-center gap-2">
        <VBtn
          :disabled="keyConfirm !== item[keyDestroy]"
          variant="elevated"
          @click="onConfirmation"
        >
          {{ confirmButtonText }}
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="onCancel"
        >
          {{ cancelButtonText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
