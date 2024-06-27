<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useEmpresaStore } from './store/useEmpresaStore'
import type { IEmpresa } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'empresa',
  },
})

const store = useEmpresaStore()

const {
  items,
  itemsPerPage,
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
      title: t('empresa.headers.cnpj'),
      key: 'cnpj',
    },

    {
      title: t('empresa.headers.razao_social'),
      key: 'razao_social',
    },

    {
      title: t('empresa.headers.email'),
      key: 'email',
    },

    {
      title: t('empresa.headers.telefone'),
      key: 'telefone',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('empresa.terms.cnpj'),
      value: 'cnpj',
    },
    {
      title: t('empresa.terms.razao_social'),
      value: 'razao_social',
    },
    {
      title: t('empresa.terms.email'),
      value: 'email',
    },
    {
      title: t('empresa.terms.telefone'),
      value: 'telefone',
    },
    {
      title: t('empresa.terms.cep'),
      value: 'cep',
    },
    {
      title: t('empresa.terms.logradouro'),
      value: 'logradouro',
    },
    {
      title: t('empresa.terms.numero'),
      value: 'numero',
    },
    {
      title: t('empresa.terms.bairro'),
      value: 'bairro',
    },
    {
      title: t('empresa.terms.cidade'),
      value: 'cidade',
    },
    {
      title: t('empresa.terms.uf'),
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
    to: (item: IEmpresa) => `/empresa/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: IEmpresa) => dialogDestroy(item.id),
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
    :title="$t('empresa.list')"

    new-item="/empresa/cadastrar"
    :headers="headers"
    :actions="actions"
    :items-per-page="itemsPerPage"
    :page="page"

    :load-more="loadMore"
    :terms-search="terms"
    :on-search="onSearch"
    :on-search-again="onSearchAgain"
    :on-reset="resetSearch"
    :on-order-by="onOrderBy"
  />
</template>
