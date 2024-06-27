<script setup lang="ts">
// eslint-disable-next-line no-restricted-imports
import { VDataTable } from 'vuetify/components'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import CDFButton from '@/components/CDF/CDFButton.vue'
import CDFActionButton from '@/components/CDF/CDFActionButton.vue'
import type { ISearch } from '@/components/CDF/SearchBar.vue'
import { can } from '@layouts/plugins/casl'
import { getI18n } from '@/plugins/i18n'
import ConfirmDialog from '@/components/CDF/ConfirmDialog.vue'
import type { ILayoutTable } from '@/pages/types/layoutTable.types'

const props = withDefaults(defineProps<ILayoutTable>(), {
  itemsPerPage: 10,
})

const emit = defineEmits<{
  (e: 'update:loading', value: boolean): void
  (e: 'update:search', value: ISearch): void
  (e: 'update:confirmDestroyItem', value: boolean): void
}>()

const i18n = getI18n()
const { t } = useI18n(i18n)

const searchField = ref<string>('')
const searchTerm = ref<string>('')
const searchRelationship = ref<string>('')
const search = toRef(props, 'search')
const isSearching = toRef(props, 'isSearching')
const confirmDestroyItem = toRef(props, 'confirmDestroyItem')
const loadingDestroy = toRef(props, 'loadingDestroy')

const getHeaders = computed(() => {
  return props.headers.concat({
    title: t('vDataTable.headers.action'),
    key: 'acoes',
    sortable: false,
    minWidth: 'max-content',
    align: 'center',
    cellProps() {
      return {
        class: 'd-flex align-center justify-center gap-2',
      }
    },
  })
})

const infinite = ref<StateHandler>()

const updateSearch = (e: ISearch) => {
  search.value = e
  emit('update:search', e)
}

const updateDialogDestroy = (e: boolean) => {
  confirmDestroyItem.value = !confirmDestroyItem.value
  emit('update:confirmDestroyItem', e)
}

const load = (e: StateHandler) => {
  infinite.value = e
  props?.loadMore(e)
}
</script>

<template>
  <ConfirmDialog
    v-model:isDialogVisible="confirmDestroyItem"
    v-model:loading="loadingDestroy"
    confirm-button-text="Sim, excluir"
    cancel-button-text="Não, cancelar"
    confirmation-msg="Tem certeza que deseja excluir este registro?"
    @confirm="destroy"
    @cancel="updateDialogDestroy(false)"
  />

  <!-- Header -->
  <VCard class="mb-2">
    <VCardItem>
      <VRow
        class="pa-4"
        align="center"
      >
        <VCardTitle>
          <template #default>
            <h2 class="text-h3 text-lg-h4">
              {{ title }}
            </h2>
          </template>
        </VCardTitle>
        <VSpacer />
        <VCardActions class="py-0">
          <CDFButton
            icon="tabler-plus"
            color="primary"
            variant="outlined"
            :to="newItem"
          >
            {{ newItemText ?? $t('Register') }}
          </CDFButton>
        </VCardActions>
      </VRow>
    </VCardItem>
  </VCard>

  <!-- Content -->
  <VCard>
    <VCardItem>
      <VDataTable
        :headers="getHeaders"
        hover
        :items="items"
        items-per-page-text="Registros por página"
        :items-per-page="itemsPerPage"
        :loading="loading"
        @update:sort-by="(value) => onOrderBy?.(infinite, value)"
      >
        <template
          v-for="(_, slot) of $slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope"
          />
        </template>
        <template #item.acoes="{ item }">
          <slot name="actions" />
          <template v-for="(action, indexAction) in actions">
            <CDFActionButton
              v-if="action?.can ? can(action?.can.action, action?.can.subject) : true"
              :key="indexAction"
              :icon="action.icon"
              :color="action.color"
              :to="action.to ? action?.to(item) : action.to"
              @click="() => action?.onClick ? action?.onClick(item) : null"
            />
          </template>
        </template>
        <template #top>
          <VRow
            justify="start"
            class="mb-2"
          >
            <VCol cols="8">
              <SearchBar
                v-model:search="searchField"
                v-model:field="searchTerm"
                v-model:relationship="searchRelationship"
                v-model:is-searching="isSearching"
                :terms="termsSearch"
                :on-search="() => onSearch?.(infinite)"
                :on-search-again="() => onSearchAgain?.(infinite)"
                :on-reset="() => onReset?.(infinite)"
                @update:searching="updateSearch"
              />
            </VCol>
          </VRow>
        </template>
        <template #no-data>
          {{ $t("vDataTable.no-data") }}
        </template>
        <template #loading>
          <VSkeletonLoader type="table-row@5" />
        </template>
        <template #bottom>
          <div class="d-flex justify-center my-5">
            <InfiniteLoading
              v-if="loadMore"
              @infinite="load"
            >
              <template #complete>
                <span />
              </template>
              <template #error>
                <span>{{ $t("infiniteLoading.error") }}</span>
              </template>
            </InfiniteLoading>
          </div>
        </template>
      </VDataTable>
    </VCardItem>
  </VCard>
</template>
