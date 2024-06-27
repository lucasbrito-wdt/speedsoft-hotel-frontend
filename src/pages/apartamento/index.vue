<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useApartamentoStore } from './store/useApartamentoStore'
import type { IApartamento } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'apartamento',
  },
})

const store = useApartamentoStore()

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
      title: t('apartamento.headers.nome'),
      key: 'nome',
    },

    {
      title: t('apartamento.headers.codigo'),
      key: 'codigo',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('apartamento.terms.nome'),
      value: 'nome',
    },

    {
      title: t('apartamento.terms.codigo'),
      value: 'codigo',
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
    to: (item: IApartamento) => `/apartamento/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: IApartamento) => dialogDestroy(item.id),
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
    :title="$t('apartamento.list')"

    new-item="/apartamento/cadastrar"
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
