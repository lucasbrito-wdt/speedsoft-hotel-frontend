<script lang="ts" setup>
const propsComponent = defineProps<Props>()
const isMenuVisible = ref(false)
interface Props {
  chipText?: string
  textTitle: string
  textSubtitle: string
  isMenuVisible: boolean
  icon?: string
  chipColor?: string
}
</script>

<template>
  <VMenu
    :model-value="propsComponent.isMenuVisible"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <VChip
        v-bind="props"
        color="success"
      >
        <VIcon :icon="propsComponent.icon" />
      </VChip>
    </template>

    <VList>
      <VListItem>
        <VListItemTitle class="mb-2">
          {{ propsComponent.textTitle }}
        </VListItemTitle>
        <VListItemSubtitle>{{ propsComponent.textSubtitle }}</VListItemSubtitle>

        <template #append>
          <VListItemAction class="ms-3">
            <VBtn
              icon
              variant="text"
              size="x-small"
              color="default"
              @click="isMenuVisible = false"
            >
              <VIcon
                size="20"
                icon="tabler-x"
              />
            </VBtn>
          </VListItemAction>
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
