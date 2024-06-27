<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClienteStore } from '../store/useClienteStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'
import {sexo} from "@/enums/sexo";

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
}>(), {
  isEditing: false,
})

const store = useClienteStore()

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
    :title="!isEditing ? $t('cliente.register') : $t('cliente.edit')"
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
    back="/cliente"
  >
    <template #content>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.nome"
          label="Nome Completo"
          placeholder="Digite o nome completo"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.data_nasc"
          label="Data Nascimento"
          placeholder="Digite a data de nascimento"
          type="date"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppAutocomplete
          v-model="data.sexo"
          label="Sexo"
          placeholder="Digite o sexo"
          :rules="[rules.requiredValidator]"
          :items="sexo"
          item-value="value"
          item-title="label"
          :return-object="false"
          no-data-text="Nenhum registro encontrado"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.cpf"
          v-mask="'###.###.###-##'"
          label="CPF"
          placeholder="Digite o CPF"
          :rules="[rules.cpfValidator, rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.nacionalidade"
          label="Nacionalidade"
          placeholder="Digite a nacionalidade"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.profissao"
          label="Profissão"
          placeholder="Digite a profissão"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.email"
          type="email"
          label="Email"
          placeholder="Digite o endereço de e-mail"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.telefone"
          v-mask="'(##) ####-####'"
          type="tel"
          label="Telefone"
          placeholder="Digite o telefone"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <AppTextField
          v-model="data.celular"
          v-mask="'(##) #####-####'"
          type="tel"
          label="Celular"
          placeholder="Digite o celular"
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
