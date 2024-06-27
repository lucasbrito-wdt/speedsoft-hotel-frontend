<script setup lang="ts">
import FormCliente from '../components/form-cliente.vue'
import { useClienteStore } from '../store/useClienteStore'

definePage({
  meta: {
    action: 'create',
    subject: 'cliente',
  },
})

const { resetForm } = useClienteStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormCliente />
</template>
