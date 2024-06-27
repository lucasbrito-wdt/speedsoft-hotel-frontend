<script setup lang="ts">
import FormCheckin from '../components/form-checkin.vue'
import { useCheckinStore } from '../store/useCheckinStore'

definePage({
  meta: {
    action: 'edit',
    subject: 'checkin',
  },
})

const store = useCheckinStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormCheckin is-editing />
</template>
