<script setup lang="ts">
import FormCliente from '../components/form-cliente.vue'
import { useClienteStore } from '../store/useClienteStore'

definePage({
  meta: {
    action: 'edit',
    subject: 'cliente',
  },
})

const store = useClienteStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormCliente is-editing />
</template>
