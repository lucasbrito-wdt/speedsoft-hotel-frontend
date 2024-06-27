<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useClienteStore } from './store/useClienteStore'
import type { ICliente } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'
import moment from 'moment'

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'cliente',
  },
})

const store = useClienteStore()

const {
  items,
  totalItems,
  page,
  loading,
  searchTerm,
  isSearching,
  confirmDestroyItem,
} = storeToRefs(store)

const {
  loadMore,
  search: onSearch,
  searchAgain: onSearchAgain,
  resetSearch,
  destroy,
  dialogDestroy,
  onOrderBy,
} = store

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    {
      title: t('cliente.headers.nome'),
      key: 'nome',
    },
    {
      title: t('cliente.headers.data_nasc'),
      key: 'data_nasc',
    },
    {
      title: t('cliente.headers.cpf'),
      key: 'cpf',
    },
    {
      title: t('cliente.headers.celular'),
      key: 'celular',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('cliente.terms.nome'),
      value: 'nome',
    },

    {
      title: t('cliente.terms.data_nasc'),
      value: 'data_nasc',
    },

    {
      title: t('cliente.terms.sexo'),
      value: 'sexo',
    },

    {
      title: t('cliente.terms.cpf'),
      value: 'cpf',
    },

    {
      title: t('cliente.terms.nacionalidade'),
      value: 'nacionalidade',
    },

    {
      title: t('cliente.terms.profissao'),
      value: 'profissao',
    },

    {
      title: t('cliente.terms.email'),
      value: 'email',
    },

    {
      title: t('cliente.terms.telefone'),
      value: 'telefone',
    },

    {
      title: t('cliente.terms.celular'),
      value: 'celular',
    },

    {
      title: t('cliente.terms.cep'),
      value: 'cep',
    },

    {
      title: t('cliente.terms.logradouro'),
      value: 'logradouro',
    },

    {
      title: t('cliente.terms.numero'),
      value: 'numero',
    },

    {
      title: t('cliente.terms.bairro'),
      value: 'bairro',
    },

    {
      title: t('cliente.terms.cidade'),
      value: 'cidade',
    },

    {
      title: t('cliente.terms.uf'),
      value: 'uf',
    },
  ]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'user',
    },
    to: (item: ICliente) => `/cliente/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: ICliente) => dialogDestroy(item.id),
  },
]

onBeforeRouteLeave(() => {
  store.$reset()
})
</script>

<template>
  <LayoutTable
    v-model:items="items"
    v-model:loading="loading.items"
    v-model:loading-destroy="loading.destroy"
    v-model:search="searchTerm"
    v-model:is-searching="isSearching"
    v-model:confirmDestroyItem="confirmDestroyItem"
    :destroy="destroy"
    :title="$t('cliente.list')"

    new-item="/cliente/cadastrar"
    :headers="headers"
    :actions="actions"
    :items-per-page="totalItems"
    :page="page"

    :load-more="loadMore"
    :terms-search="terms"
    :on-search="onSearch"
    :on-search-again="onSearchAgain"
    :on-reset="resetSearch"
    :on-order-by="onOrderBy"
  >
    <template #item.nome="{ item }">
      {{ item.nome.toString().toUpperCase() }}
    </template>
    <template #item.data_nasc="{ item }">
      {{ moment(item.data_nasc).format('DD/MM/YYYY') }}
    </template>
    <template #item.celular="{ item }">
      {{ item.celular || '-' }}
    </template>
  </LayoutTable>
</template>
