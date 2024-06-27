<script setup lang="ts">
import { Mask } from 'maska'
import { toRef } from 'vue'
import CDFButton from '@/components/CDF/CDFButton.vue'
import { getI18n } from '@/plugins/i18n'

export interface ITerm {
  title: string
  value: string
  relationship?: string
  mask?: string
}

export interface ISearch {
  field?: string
  search?: string
  relationship?: string
}

const props = defineProps<{
  terms: ITerm[]
  field: string
  relationship: string
  search: string
  isSearching: boolean
  onSearch: () => void
  onSearchAgain: () => void
  onReset: () => void
}>()

const emit = defineEmits<{
  (e: 'update:field', value: string): void
  (e: 'update:search', value: string): void
  (e: 'update:relationship', value: string): void
  (e: 'update:searching', value: ISearch): void
  (e: 'update:isSearching', value: boolean): void
}>()

const field = toRef(props, 'field')
const search = toRef(props, 'search')
const terms = toRef(props, 'terms')
const isSearching = toRef(props, 'isSearching')
const i18n = getI18n()
const { t } = useI18n(i18n)

const selectedEl = ref(null)
const inputEl = ref<HTMLInputElement>(null)
const mask = ref<Mask>(null)

const updateField = (value: string) => {
  mask.value = terms.value.find(t => t.value === value)?.mask
    ? new Mask({ mask: terms.value.find(t => t.value === value)?.mask })
    : null

  inputEl.value.focus()

  emit('update:field', value)
  emit('update:relationship', terms.value.find(term => term.value === value)?.relationship || '')
  emit('update:searching', {
    field: value,
    search: search.value,
    relationship: terms.value.find(term => term.value === value)?.relationship || '',
  })
}

const updateSearch = (value: string) => {
  emit('update:search', value)
  emit('update:searching', {
    field: field.value,
    search: value,
    relationship: terms.value.find(term => term.value === field.value)?.relationship || '',
  })
}

const onSearch = () => {
  if (isSearching.value)
    props.onSearchAgain()
  else
    props.onSearch()

  emit('update:searching', {
    field: field.value,
    search: search.value,
    relationship: terms.value.find(term => term.value === field.value)?.relationship || '',
  })
}

const reset = () => {
  props.onReset()

  selectedEl.value?.reset()
  field.value = ''
  search.value = ''
  isSearching.value = false

  emit('update:field', '')
  emit('update:search', '')
  emit('update:searching', {
    field: '',
    search: '',
    relationship: '',
  })
  emit('update:isSearching', false)
}

const getItems = computed(() => {
  return [
    ...terms.value,
    {
      title: t('search.terms.listAll'),
      value: 'all',
    },
  ]
})
</script>

<template>
  <VTextField
    ref="inputEl"
    v-model="search"
    class="cdf-search"
    :model-value="mask ? mask.masked(search) : search"
    :placeholder="$t('search.placeholder')"
    @update:model-value="updateSearch"
  >
    <template #prepend>
      <VSelect
        ref="selectedEl"
        v-model="field"
        class="cdf-select"
        :items="getItems"
        variant="outlined"
        single-line
        item-value="value"
        item-title="title"
        @update:model-value="updateField"
      >
        <template #chip="{ item, index }">
          <div :key="index">
            <VIcon icon="tabler-filter" />
            {{ $t('Procurar') }} ({{ item.title ? item.title : $t('Por') }}):
          </div>
        </template>
        <template #selection="{ item, index }">
          <div :key="index">
            <VIcon icon="tabler-filter" />
            {{ $t('Procurar') }} ({{ item.title }}):
          </div>
        </template>
        <template #item="{ props, item }">
          <VListItem
            v-if="item.value !== 'all'"
            v-bind="props"
            :title="item.title"
          />
          <VListItem
            v-else
            v-bind="props"
            :title="item.title"
            prepend-icon="tabler-list"
            @click="() => reset()"
          />
        </template>
      </VSelect>
    </template>
    <template #append>
      <CDFButton
        v-if="isSearching"
        class="cdf-search-btn-x"
        icon="tabler-x"
        variant="text"
        is-icon
        @click="() => reset()"
      />
      <CDFButton
        :disabled="!(field.length > 0 && search.length > 0)"
        class="cdf-search-btn"
        icon="tabler-search"
        variant="outlined"
        is-icon
        @click="() => onSearch()"
      />
    </template>
  </VTextField>
</template>

<style lang="scss">
.cdf-search {
  .v-input__prepend, .v-input__append {
    margin-inline-end: 0 !important;
    margin-inline-start: 0 !important;
  }
  .v-field {
    border-radius: 0;
  }
  .cdf-select {
    .v-field {
      border-radius: 5px 0 0 5px;
    }
  }
  .cdf-search-btn-x{
    border-radius: 0 !important;
    border: thin rgba(var(--v-border-color), var(--v-border-opacity)) solid;

    &:hover{
      border: thin solid currentColor
    }
  }

  .cdf-search-btn{
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border: thin rgba(var(--v-border-color), var(--v-border-opacity)) solid;

    &:hover{
      border: thin solid currentColor
    }
  }
}
</style>
