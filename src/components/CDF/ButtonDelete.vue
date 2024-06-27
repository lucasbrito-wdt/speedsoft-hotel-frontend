<script setup lang="ts">
interface Props {
  loading: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <div>
    <VBtn
      icon
      color="error"
      variant="tonal"
      size="small"
      class="rounded"
    >
      <VTooltip
        location="top"
        activator="parent"
      >
        Excluir
      </VTooltip>
      <VProgressCircular
        v-if="props.loading"
        :width="3"
        size="24"
        color="white"
        indeterminate
      />
      <VIcon
        v-if="!props.loading"
        size="18"
        icon="tabler-trash"
      />
    </VBtn>
  </div>
</template>
