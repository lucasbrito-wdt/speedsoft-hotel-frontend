<script lang="ts" setup>
interface MenuList {
  title?: string
  click?: void | Promise<void>
  class?: string
  type?: string
}

interface Props {
  menuList?: MenuList[]
  itemProps?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <IconBtn
        density="compact"
        color="disabled"
        v-bind="props"
      >
        <VIcon icon="tabler-dots-vertical" />
      </IconBtn>
    </template>
    <VList :item-props="props.itemProps">
      <VListItem
        v-for="(item, i) in props.menuList"
        v-bind="item"
        :key="i"
        :style="item.type === 'divider' ? 'min-height: 0px !important' : null"
        @click="item.click"
      >
        <template #title>
          <span v-if="item?.type !== 'divider'">{{ item.title }}</span>
          <VDivider v-else />
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
