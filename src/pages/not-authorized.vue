<script setup lang="ts">
import pages401 from '@images/pages/401.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import useLogin from '@/pages/auth/login/useLogin'

const loginStore = useLogin()
const { logout } = loginStore

definePage({
  alias: '/pages/misc/not-authorized',
  meta: {
    layout: 'blank',
    public: true,
  },
})

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="401"
      title="Você não tem autorização! 🔐"
      description="Você não tem permissão para acessar essa página, por favor entre em contato com o suporte para mais detalhes."
    />

    <VBtn
      class="mt-2 mb-10"
      @click="logout"
    >
      Voltar
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pages401"
        alt="Erro"
        :max-width="170"
        class="mx-auto"
      />
    </div>

    <VImg
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
