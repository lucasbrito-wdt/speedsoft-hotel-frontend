<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useApartamentoStore } from '../store/useApartamentoStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
}>(), {
  isEditing: false,
})

const store = useApartamentoStore()

onMounted(() => {
  // 👉 methods

})

const {
  form,
  data,
  loading,
  messages,

} = storeToRefs(store)

const {
  save,
  update,
  resetForm,

} = store

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    v-model:messages="messages"
    :title="!isEditing ? $t('apartamento.register') : $t('apartamento.edit')"
    :is-editing="isEditing"
    :actions="{
      save: {
        method: () => save(),
      },
      update: {
        method: () => update(),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/apartamento"
  >
    <template #content>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.nome"
          label="Nome"
          hint=""
          placeholder=""
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.codigo"
          label="Codigo"
          hint=""
          placeholder=""
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppAutocomplete
          v-model="data.status"
          label="Status"
          hint=""
          placeholder=""
          item-value="id"
          item-title="nome"
          :items="[
            {
              id: '0',
              nome: 'Limpo',
            },
            {
              id: '1',
              nome: 'Sujo',
            },
            {
              id: '2',
              nome: 'Sair',
            },
            {
              id: '3',
              nome: 'Interditado',
            },
            {
              id: '4',
              nome: 'Ocupado',
            },
          ]"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
    </template>
  </LayoutForms>
</template>
