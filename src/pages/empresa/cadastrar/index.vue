<script setup lang="ts">
import FormEmpresa from '../components/form-empresa.vue'
import { useEmpresaStore } from '../store/useEmpresaStore'

definePage({
  meta: {
    action: 'create',
    subject: 'empresa',
  },
})

const { resetForm } = useEmpresaStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormEmpresa />
</template>
