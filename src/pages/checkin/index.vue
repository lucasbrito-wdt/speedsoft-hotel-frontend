<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import moment from 'moment'
import { useCheckinStore } from './store/useCheckinStore'
import type { ICheckin } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'checkin',
  },
})

const store = useCheckinStore()

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
      title: t('checkin.headers.apartamento'),
      key: 'apartamento',
    },
    {
      title: t('checkin.headers.cliente'),
      key: 'cliente',
    },
    {
      title: t('checkin.headers.chegada'),
      key: 'chegada',
    },
    {
      title: t('checkin.headers.saida'),
      key: 'saida',
    },
    {
      title: t('checkin.headers.quantidade_adulto'),
      key: 'quantidade_adulto',
    },
    {
      title: t('checkin.headers.quantidade_crianca'),
      key: 'quantidade_crianca',
    },
    {
      title: t('checkin.headers.valor_diaria'),
      key: 'valor_diaria',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('checkin.terms.chegada'),
      value: 'chegada',
      mask: '##/##/#### ##:##',
    },

    {
      title: t('checkin.terms.saida'),
      value: 'saida',
      mask: '##/##/#### ##:##',
    },

    {
      title: t('checkin.terms.quantidade_adulto'),
      value: 'quantidade_adulto',
    },

    {
      title: t('checkin.terms.quantidade_crianca'),
      value: 'quantidade_crianca',
    },

    {
      title: t('checkin.terms.motivo_viagem'),
      value: 'motivo_viagem',
    },

    {
      title: t('checkin.terms.meio_transporte'),
      value: 'meio_transporte',
    },

    {
      title: t('checkin.terms.placa'),
      value: 'placa',
    },

    {
      title: t('checkin.terms.valor_diaria'),
      value: 'valor_diaria',
    },

    {
      title: t('checkin.terms.valor_diaria_extra'),
      value: 'valor_diaria_extra',
    },

    {
      title: t('checkin.terms.valor_iss'),
      value: 'valor_iss',
    },

    {
      title: t('checkin.terms.aliquota_iss'),
      value: 'aliquota_iss',
    },

    {
      title: t('checkin.terms.total'),
      value: 'total',
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
    to: (item: ICheckin) => `/checkin/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: ICheckin) => dialogDestroy(item.id),
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
    :title="$t('checkin.list')"
    :is-actions-top="false"

    new-item="/checkin/cadastrar"
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
    <template #item.chegada="{ item }">
      {{ moment(item.chegada).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.saida="{ item }">
      {{ moment(item.saida).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.cliente="{ item }">
      {{ item.cliente.nome.toString().toUpperCase() }}
    </template>
    <template #item.apartamento="{ item }">
      {{ item.apartamento.nome }}
    </template>
    <template #item.valor_diaria="{ item }">
      {{ item.valor_diaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
    </template>
  </LayoutTable>
</template>
