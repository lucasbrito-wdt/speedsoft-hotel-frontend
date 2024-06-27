<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEmpresaStore } from '../store/useEmpresaStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(
  defineProps<{
    isEditing: boolean
  }>(),
  {
    isEditing: false,
  },
)

const store = useEmpresaStore()

onMounted(() => {
  // 👉 methods
})

const { form, data, loading, messages } = storeToRefs(store)

const { save, update, resetForm } = store

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    v-model:messages="messages"
    :title="!isEditing ? $t('empresa.register') : $t('empresa.edit')"
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
    back="/empresa"
  >
    <template #content>
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="data.cnpj"
          v-mask="'##.###.###/####-##'"
          label="CNPJ"
          placeholder="Digite o CNPJ da empresa"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="data.razao_social"
          label="Razão Social"
          placeholder="Digite a razão social da empresa"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="data.email"
          label="Email"
          placeholder="Digite o email da empresa"
          :rules="[rules.emailValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="data.telefone"
          v-mask="'(##)####-####'"
          label="Telefone"
          placeholder="Digite o numero de telefone"
        />
      </VCol>
      <VCol cols="12">
        <Endereco
          v-model:data="data"
          :readonly="isEditing"
        />
      </VCol>
    </template>
  </LayoutForms>
</template>
