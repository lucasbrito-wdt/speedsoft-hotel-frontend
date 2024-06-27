<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCheckinStore } from '../store/useCheckinStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'
import { blurHandler } from '@/utils/generals'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
}>(), {
  isEditing: false,
})

const store = useCheckinStore()
const router = useRouter()
const apartamentoId = router.currentRoute.value.query.apt

onMounted(() => {
  // 👉 methods
  fetchApartamento()
  fetchEmpresa()
  fetchCliente()

  store.data.apartamento_id = apartamentoId
})

const {
  form,
  data,
  loading,
  messages,
  apartamentos,
  empresas,
  clientes,
  isStartCheckIn,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
  startCheckIn,
  cancelCheckIn,
  fetchApartamento,
  fetchEmpresa,
  fetchCliente,
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
    :title="!isEditing ? $t('checkin.register') : $t('checkin.edit')"
    :is-editing="isEditing"
    :actions="{
      save: {
        text: !isStartCheckIn ? 'Iniciar Check-in' : 'Finalizar',
        method: () => !isStartCheckIn ? startCheckIn() : save(),
      },
      update: {
        method: () => !isStartCheckIn ? cancelCheckIn() : update(),
      },
      reset: {
        text: isStartCheckIn ? 'Voltar' : 'Limpar',
        method: () => isStartCheckIn ? cancelCheckIn() : resetForm(),
      },
    }"
    back="/checkin"
  >
    <template #content>
      <template v-if="!isStartCheckIn">
        <VCol
          cols="12"
          md="6"
        >
          <AppAutocomplete
            v-model="data.apartamento_id"
            v-debounce:900="fetchApartamento"
            :items="apartamentos"
            label="Apartamento"
            :return-object="false"
            :loading="loading.apartamento"
            :rules="[rules.requiredValidator]"
            item-value="id"
            item-title="nome"
            placeholder="Insira o número do apartamento"
            no-data-text="Nenhum apartamento encontrado"
          >
            <template #clear>
              <button
                @click="() => {
                  fetchApartamento()
                  blurHandler()
                }"
              >
                <VIcon icon="tabler-x" />
              </button>
            </template>
          </AppAutocomplete>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            v-model="data.reseva"
            label="Reseva"
            placeholder="Digite o número da reserva"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppAutocomplete
            v-model="data.cliente_id"
            v-debounce:900="fetchCliente"
            :items="clientes"
            label="Cliente"
            :return-object="false"
            :loading="loading.cliente"
            :rules="[rules.requiredValidator]"
            item-value="id"
            item-title="nome"
            placeholder="Insira o nome do cliente"
            no-data-text="Nenhum cliente encontrado"
          >
            <template #clear>
              <button
                @click="() => {
                  fetchCliente()
                  blurHandler()
                }"
              >
                <VIcon icon="tabler-x" />
              </button>
            </template>
          </AppAutocomplete>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppAutocomplete
            v-model="data.empresa_id"
            v-debounce:900="fetchEmpresa"
            :items="empresas"
            label="Empresa"
            :return-object="false"
            :loading="loading.empresa"
            item-value="id"
            item-title="razao_social"
            placeholder="Insira o nome da empresa"
            no-data-text="Nenhuma empresa encontrada"
          >
            <template #clear>
              <button
                @click="() => {
                  fetchEmpresa()
                  blurHandler()
                }"
              >
                <VIcon icon="tabler-x" />
              </button>
            </template>
          </AppAutocomplete>
        </VCol>
      </template>
      <template v-else>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.chegada"
            label="Data Chegada"
            placeholder="Digite a data de chegada"
            type="datetime-local"
            :rules="[rules.requiredValidator]"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.saida"
            label="Data Saída"
            placeholder="Digite a data de saída"
            type="datetime-local"
            :rules="[rules.requiredValidator]"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.quantidade_adulto"
            type="number"
            label="Quantidade Adulto"
            placeholder="Digite a quantidade de adultos"
            :rules="[rules.requiredValidator]"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.quantidade_crianca"
            type="number"
            label="Quantidade Criança"
            placeholder="Digite a quantidade de crianças"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.motivo_viagem"
            label="Motivo Viagem"
            placeholder="Digite o motivo da viagem"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.meio_transporte"
            label="Meio Transporte"
            placeholder="Digite o meio de transporte"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="data.placa"
            label="Placa"
            placeholder="Digite a placa"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <InputDinheiro
            v-model="data.valor_diaria"
            label="Valor Diária"
            placeholder="Digite o valor da diária"
            prepend-inner-icon="tabler-currency-real"
            :rules="[rules.requiredValidator]"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <InputDinheiro
            v-model="data.valor_diaria_extra"
            label="Valor Diária Extra"
            placeholder="Digite o valor da diária extra"
            prepend-inner-icon="tabler-currency-real"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <InputDinheiro
            v-model="data.valor_iss"
            label="Valor ISS"
            placeholder="Digite o valor do ISS"
            prepend-inner-icon="tabler-currency-real"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <InputDinheiro
            v-model="data.aliquota_iss"
            label="Alíquota ISS"
            placeholder="Digite a alíquota do ISS"
            prepend-inner-icon="tabler-currency-real"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <InputDinheiro
            v-model="data.total"
            label="Total"
            placeholder="Digite o total"
            prepend-inner-icon="tabler-currency-real"
          />
        </VCol>
      </template>
    </template>
  </LayoutForms>
</template>
