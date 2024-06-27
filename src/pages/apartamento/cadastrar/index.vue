<script setup lang="ts">
import FormApartamento from '../components/form-apartamento.vue'
import { useApartamentoStore } from '../store/useApartamentoStore'

definePage({
  meta: {
    action: 'create',
    subject: 'apartamento',
  },
})

const { resetForm } = useApartamentoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormApartamento />
</template>
