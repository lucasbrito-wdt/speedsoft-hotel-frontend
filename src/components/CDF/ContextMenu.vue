<script setup lang="ts">
interface MenuList {
  title?: string
  prependIcon?: string
  appendIcon?: string
  click?: void | Promise<void>
  class?: string
  type?: string
}

const props = defineProps<{
  items: MenuList[]
}>()

const show = ref<boolean>(false)
const position = reactive({ x: 0, y: 0 })
const items = toRef(props, 'items')

const showMenu = (event: MouseEvent) => {
  event.preventDefault()

  show.value = !show.value
  position.x = event.x
  position.y = event.y
}
</script>

<template>
  <VMenu
    v-model:model-value="show"
    location="top"
    transition="slide-x-transition"
    content-class="context-menu"
    :style="`--position-x: ${position.x}px; --position-y: ${position.y}px;`"
  >
    <template #activator="{ props }">
      <div @contextmenu.prevent="(e) => showMenu(e)">
        <slot />
      </div>
    </template>

    <VList>
      <VListItem
        v-for="(item, i) in items"
        v-bind="item"
        :key="i"
        append-icon=""
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

<style lang="scss">
.context-menu {
  position: fixed;
  top: var(--position-y);
  left: var(--position-x);
  z-index: 9999;
}
</style>
