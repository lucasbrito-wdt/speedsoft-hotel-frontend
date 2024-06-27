<script setup lang="ts">
import { checkMimeType } from '@/utils/generals'

const props = withDefaults(defineProps<{
  modelValue: string
}>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputFileRef = ref<HTMLInputElement>()
const modelValue = toRef(props, 'modelValue')

const changeAvatar = () => {
  const selectedFile = inputFileRef.value?.files[0]

  if (selectedFile) {
    const fileReader = new FileReader()

    fileReader.readAsDataURL(selectedFile)

    fileReader.onload = () => {
      modelValue.value = fileReader.result
      emit('update:modelValue', fileReader.result)
    }
  }
}

const previewValue = computed(() => {
  return checkMimeType(props.modelValue) ? props.modelValue : ''
})

const openFile = () => {
  inputFileRef.value?.click()
}

const resetFile = () => {
  inputFileRef.value!.value = ''
  modelValue.value = ''

  emit('update:modelValue', '')
}
</script>

<template>
  <div class="enviar-imagem position-relative">
    <input
      ref="inputFileRef"
      type="file"
      hidden
      @change="changeAvatar"
    >
    <VAvatar
      class="enviar-imagem-avatar"
      color="primary"
      variant="tonal"
      rounded="100%"
      size="150"
      :image="previewValue"
      @click="openFile"
    >
      <VIcon
        size="40"
        color="high-emphasis"
        icon="tabler-cloud-upload"
      />
    </VAvatar>
    <div class="enviar-imagem-actions">
      <CDFButton
        v-if="previewValue?.length > 0"
        is-icon
        icon="tabler-cloud-upload"
        variant="text"
        class="enviar-imagem-btn"
        color="info"
        rounded="100%"
        size="30px"
        @click="openFile"
      />
      <CDFButton
        v-if="previewValue?.length > 0 || modelValue?.length > 0"
        is-icon
        :icon="getExtension(modelValue) && modelValue?.length > 0 ? 'tabler-trash' : 'tabler-x'"
        variant="text"
        class="enviar-imagem-btn"
        color="error"
        rounded="100%"
        size="30px"
        @click="resetFile"
      />
    </div>
  </div>
</template>

<style lang="scss">
.enviar-imagem {
  .enviar-imagem-avatar:hover{
    opacity: 0.7;
    cursor: pointer;
  }

  .enviar-imagem-actions{
    position: absolute;
    bottom: 30px;
    right: -15px;
    transform: translate(50%, 50%);
    display: flex;
    flex-direction: column;
    gap: 2px;

    .enviar-imagem-btn{}
  }
}
</style>
