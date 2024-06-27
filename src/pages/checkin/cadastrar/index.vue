<script setup lang="ts">
import FormCheckin from '../components/form-checkin.vue'
import { useCheckinStore } from '../store/useCheckinStore'

definePage({
  meta: {
    action: 'create',
    subject: 'checkin',
  },
})

const { resetForm } = useCheckinStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormCheckin />
</template>
