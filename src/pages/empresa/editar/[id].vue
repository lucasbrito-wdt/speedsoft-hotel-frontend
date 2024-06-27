<script setup lang="ts">
import FormEmpresa from '../components/form-empresa.vue'
import { useEmpresaStore } from '../store/useEmpresaStore'

definePage({
  meta: {
    action: 'edit',
    subject: 'empresa',
  },
})

const store = useEmpresaStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormEmpresa is-editing />
</template>
