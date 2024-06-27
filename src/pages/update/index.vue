<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import logo from '@images/logos/brand-color.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

const checking = ref(false)
const updateAvailable = ref(false)
const versionInfo = ref(null)
const updateError = ref(null)
const progressInfo = ref({ percent: 0 })
const modalOpen = ref(false)
const updating = ref(false)

const modalBtn = ref({
  cancelText: null,
  okText: null,
  onCancel: () => (modalOpen.value = false),
  onOk: () => window.ipcRenderer.invoke('start-download'),
})

const checkUpdate = async () => {
  checking.value = true

  const result = await window.ipcRenderer.invoke('check-update')

  progressInfo.value = { percent: 0 }
  checking.value = false
  modalOpen.value = true
  if (result?.error) {
    updateAvailable.value = false
    updateError.value = result.error
  }
}

const onUpdateCanAvailable = (_event, arg1) => {
  versionInfo.value = arg1
  updateError.value = null
  if (arg1.update) {
    modalBtn.value = {
      ...modalBtn.value,
      cancelText: 'Cancelar',
      okText: 'Atualizar',
      onOk: () => window.ipcRenderer.invoke('start-download'),
    }
    updateAvailable.value = true
  }
  else {
    updateAvailable.value = false
  }
}

const onUpdateError = (_event, arg1) => {
  updateAvailable.value = false
  updateError.value = arg1
}

const onDownloadProgress = (_event, arg1) => {
  progressInfo.value = arg1
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onUpdateDownloaded = (_event, ...args) => {
  updating.value = false
  progressInfo.value = { percent: 100 }
  modalBtn.value = {
    ...modalBtn.value,
    cancelText: 'Mais tarde',
    okText: 'Instalar agora',
    onOk: () => window.ipcRenderer.invoke('quit-and-install'),
  }
}

onMounted(() => {
  window.ipcRenderer.on('update-can-available', onUpdateCanAvailable)
  window.ipcRenderer.on('update-error', onUpdateError)
  window.ipcRenderer.on('download-progress', onDownloadProgress)
  window.ipcRenderer.on('update-downloaded', onUpdateDownloaded)
})

onBeforeUnmount(() => {
  window.ipcRenderer.off('update-can-available', onUpdateCanAvailable)
  window.ipcRenderer.off('update-error', onUpdateError)
  window.ipcRenderer.off('download-progress', onDownloadProgress)
  window.ipcRenderer.off('update-downloaded', onUpdateDownloaded)
})

// eslint-disable-next-line @typescript-eslint/no-shadow
const getInfo = versionInfo => {
  if (!versionInfo)
    return null

  if (versionInfo.update)
    return `v${versionInfo.version} -> v${versionInfo.newVersion} (Atualização disponível)`

  return `v${versionInfo.version} (Atualizado)`
}

const appName = import.meta.env.VITE_APP_NAME
const appSoftware = import.meta.env.VITE_APP_SOFTWARE
const appVersion = await window.ipcRenderer.invoke('app/version')
</script>

<template>
  <VDialog
    v-model="modalOpen"
    max-width="600"
  >
    <VCard title="Verificação de Atualização">
      <template #item>
        <div v-if="updateError">
          <p>Erro ao baixar a versão mais recente.</p>
          <p>{{ updateError.message }}</p>
        </div>
        <div v-else-if="updateAvailable">
          <div>A última versão é: v{{ versionInfo?.newVersion }}</div>
          <div class="new-version__target">
            v{{ versionInfo?.version }} -&gt; v{{ versionInfo?.newVersion }}
          </div>
          <div class="update__progress">
            <div class="progress__title">
              Atualização em processo:
            </div>
            <div class="progress__bar">
              <VProgressLinear v-model="progressInfo.percent" />
            </div>
          </div>
        </div>
        <div
          v-else
          class="can-not-available"
        >
          {{ getInfo(versionInfo) }}
        </div>
      </template>
      <VCardActions class="d-flex justify-end mt-4">
        <CDFButton
          v-if="updateAvailable"
          variant="flat"
          :disabled="updating"
          :loading="updating"
          @click="() => {
            updating = true
            modalBtn?.onOk()
          }"
        >
          {{ modalBtn.okText }}
        </CDFButton>
        <CDFButton
          variant="flat"
          color="error"
          @click="modalBtn?.onCancel"
        >
          {{ modalBtn?.cancelText ?? 'Fechar' }}
        </CDFButton>
      </VCardActions>
    </VCard>
  </VDialog>

  <VCard class="mb-4">
    <VCardText>
      <VRow>
        <VCol
          cols="1"
          class="d-flex justify-center align-center"
        >
          <VNodeRenderer
            :nodes="h('div', { innerHTML: logo })"
            class="logo"
          />
        </VCol>
        <VCol cols="11">
          <VCardTitle>
            {{ appSoftware }}
          </VCardTitle>
          <VCardSubtitle>
            <p>Version: {{ appVersion }}</p>
            <p class="mb-0">
              Licenciado para: <strong>{{ appName }}</strong>
            </p>
            <p class="mb-0">
              Copyright &copy; {{ new Date().getFullYear() }} - Web Design Technologies
            </p>
          </VCardSubtitle>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard>
    <VCardText class="d-flex flex-column align-center gap-10">
      <VIcon
        icon="tabler-cloud-computing"
        size="150"
      />

      <p class="mb-0">
        Verifique se há atualizações disponíveis para o aplicativo.
      </p>

      <VBtn
        :disabled="checking"
        @click="checkUpdate"
      >
        {{ checking ? 'Verificando atualização...' : 'Verificar atualização' }}
      </VBtn>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.logo{
  svg{
    height: 60px;
    width: auto;
  }
}
</style>
