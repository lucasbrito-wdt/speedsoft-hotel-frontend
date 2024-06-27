<script setup lang="ts">
import FormApartamento from '../components/form-apartamento.vue'
import { useApartamentoStore } from '../store/useApartamentoStore'

definePage({
  meta: {
    action: 'edit',
    subject: 'apartamento',
  },
})

const store = useApartamentoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormApartamento is-editing />
</template>
