<script setup lang="ts">
import FormUsers from '@/pages/users/components/form-users.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'

const store = useUsersStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormUsers is-editing />
</template>
