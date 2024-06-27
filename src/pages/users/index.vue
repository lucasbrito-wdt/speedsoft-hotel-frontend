<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import type { IUser } from '@/pages/users/types'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'user',
  },
})

const store = useUsersStore()

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
      title: t('users.headers.name'),
      key: 'name',
    },
    {
      title: t('users.headers.email'),
      key: 'email',
    },
    {
      title: t('users.headers.role'),
      key: 'role',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('users.terms.name'),
      value: 'name',
    },
    {
      title: t('users.terms.email'),
      value: 'email',
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
    to: (item: IUser) => `/users/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: IUser) => dialogDestroy(item.id),
  },
]
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
    :title="$t('users.list')"

    new-item="/users/cadastrar"
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
  >
    <template #item.name="{ item }">
      <VAvatar
        :size="32"
        color="primary"
        class="mr-2"
      >
        <VImg
          v-if="item.foto"
          :src="item.foto"
        />

        <span
          v-else
          class="text-xs"
        >{{ avatarText(item.name) }}</span>
      </VAvatar>
      {{ item.name }}
    </template>
    <template #item.role="{ item, index }">
      <VChip
        :key="index"
        density="comfortable"
        size="small"
      >
        {{ item.role.title }}
      </VChip>
    </template>
  </LayoutTable>
</template>
