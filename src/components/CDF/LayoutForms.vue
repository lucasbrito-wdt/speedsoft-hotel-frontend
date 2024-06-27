<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { toRef } from 'vue'
import CDFButton from '@/components/CDF/CDFButton.vue'
import ValidationDialog from '@/components/CDF/ValidationDialog.vue'

interface Action {
  text?: string
  icon?: string
  color?: string
  method?: () => void
}

interface Actions {
  save?: Action
  update?: Action
  reset?: Action
}

interface Messages {
  error: {
    isError: boolean
    status: string
    messages: string | []
  }
  success: {
    isSuccess: boolean
    message: string
  }
}

const props = defineProps<{
  title: string
  back: string
  actions?: Actions
  form: VForm
  isEditing: boolean
  loading: boolean
  messages: Messages
}>()

const emit = defineEmits<{
  (e: 'update:form', value: VForm): void
  (e: 'update:loading', value: boolean): void
  (e: 'update:messages', value: Messages): void
}>()

const formBase = ref<VForm | null>(null)

const messages = toRef(props, 'messages')
const loading = toRef(props, 'loading')

const resetErros = () => {
  emit('update:messages', {
    error: {
      isError: false,
      status: '',
      messages: [],
    },
    success: {
      isSuccess: false,
      message: '',
    },
  })
}

onMounted(() => {
  if (formBase.value)
    emit('update:form', formBase.value)
})
</script>

<template>
  <VCard>
    <ValidationDialog
      v-model:is-dialog-visible="messages.error.isError"
      v-model:error-status="messages.error.status"
      v-model:errors="messages.error.messages"
      @update:is-dialog-visible="resetErros"
    />

    <!-- Header -->
    <VCardItem>
      <VRow
        class="pa-4 py-6"
        align="center"
      >
        <VCardTitle>
          <template #default>
            <h2 class="text-h6 text-lg-h4">
              {{ title }}
            </h2>
          </template>
        </VCardTitle>
        <VSpacer />
        <VCardActions class="py-0">
          <CDFButton
            icon="tabler-arrow-back"
            color="primary"
            variant="outlined"
            :to="back"
            @click="() => {
              actions?.reset?.method()
              formBase?.reset()
              formBase?.resetValidation()
            }"
          >
            {{ $t('Voltar') }}
          </CDFButton>
        </VCardActions>
      </VRow>
      <VDivider />
    </VCardItem>

    <!-- Content -->
    <VForm
      ref="formBase"
      class="px-10"
    >
      <VRow>
        <slot name="content" />
      </VRow>
    </VForm>

    <!-- Actions -->
    <VCardItem>
      <VDivider />
      <VRow
        class="py-4 my-2"
        align="center"
      >
        <VCardActions class="py-0">
          <CDFButton
            v-model:loading="loading"
            :icon="actions?.save?.icon ?? 'tabler-send'"
            :color="actions?.save?.color ?? 'success'"
            variant="elevated"
            @click="() => {
              formBase?.validate().then(async ({ valid: isValid }) => {
                if (isValid) {
                  isEditing ? actions?.update?.method()
                  : actions?.save?.method()
                }
              });
            }"
          >
            {{ actions?.save?.text ?? $t('Salvar') }}
          </CDFButton>
          <CDFButton
            :icon="isEditing ? 'tabler-x' : actions?.reset?.icon ?? 'tabler-eraser'"
            :color="actions?.reset?.color ?? 'error'"
            variant="elevated"
            :to="isEditing ? back : null"
            @click="() => {
              actions?.reset?.method()
              formBase?.reset()
              formBase?.resetValidation()
            }"
          >
            {{ isEditing ? $t('Cancelar') : actions?.reset?.text ?? $t('Limpar') }}
          </CDFButton>
        </VCardActions>
      </VRow>
    </VCardItem>
  </VCard>
</template>
