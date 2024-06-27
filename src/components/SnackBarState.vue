<script setup lang="ts">
import { useSnackBarStore } from '@/stores/useSnackbarStore'

const store = useSnackBarStore()

const {
  show,
  text,
  color,
} = storeToRefs(store)

const {
  hideSnackBar,
} = store
</script>

<template>
  <VSnackbar
    v-model="show"
    :color="color"
    variant="flat"
    multi-line
    :timeout="3000"
    @update:model-value="v => {
      if (!v) {
        hideSnackBar()
      }
    }"
  >
    {{ text }}

    <template #actions>
      <VBtn
        color="#FFF"
        variant="text"
        @click="hideSnackBar"
      >
        Fechar
      </VBtn>
    </template>
  </VSnackbar>
</template>
