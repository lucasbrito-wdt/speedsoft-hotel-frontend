<script setup lang="ts">
export interface Message {
  title?: string | undefined
  text: string | undefined
  type: string | undefined
}

interface Props {
  msgArray?: Message[]
  title?: string
  confirmationMsg: string
  confirmationButtonText: string
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <div>
    <VDialog
      persistent
      max-width="500"
      :model-value="props.isDialogVisible"
      @update:model-value="updateModelValue"
    >
      <DialogCloseBtn @click="onConfirmation" />
      <VCard :title="title ?? 'Confirmado!'">
        <VCardText v-if="confirmationMsg">
          {{ props.confirmationMsg }}
        </VCardText>

        <div v-if="props.msgArray">
          <VCardText
            v-for="(row, index) in props.msgArray"
            :key="index"
          >
            <VAlert :color="row.type">
              <span>{{ row.title }}: {{ row.text }}</span>
            </VAlert>
          </VCardText>
        </div>

        <VCardText class="d-flex justify-end">
          <VBtn @click="onConfirmation">
            {{ props.confirmationButtonText ?? 'Ok' }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
