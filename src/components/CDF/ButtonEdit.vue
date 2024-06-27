<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: null,
  },
  path: {
    type: String,
  },
  color: {
    type: String,
    default: 'primary',
  },
  iconClass: {
    type: String,
    default: 'tabler-edit',
  },
  size: {
    type: String,
    default: 'small',
  },
})

const router = useRouter()

const redirectToEdit = () => {
  if (props.path === undefined)
    router.push(props.id)

  router.push(`${props.path}${props.id}`)
}
</script>

<template>
  <div>
    <VBtn
      icon
      :color="color"
      variant="tonal"
      :size="props.size"
      class="rounded"
      @click="redirectToEdit"
    >
      <VTooltip
        location="top"
        activator="parent"
      >
        Editar
      </VTooltip>
      <VIcon
        size="18"
        :icon="iconClass"
      />
    </VBtn>
  </div>
</template>
