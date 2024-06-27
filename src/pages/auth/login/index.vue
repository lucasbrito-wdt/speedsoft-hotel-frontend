<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { LoginResponse } from './types'
import useLogin from './useLogin'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationDark from '@images/logos/logo.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import logo from '@images/logos/brand-color.png'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const { login, erros, loading, putData } = useLogin()
const form = ref<VForm>()
const route = useRoute()
const router = useRouter()

const credentials = ref({
  email: 'admin@admin.com',
  password: '123456',
  remember: false,
})

const isPasswordVisible = ref(false)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const doLoginRequest = async () => {
  await login(credentials.value).then(async (response: LoginResponse) => {
    putData(response)
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  })
}

const onSubmit = () => {
  form.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        doLoginRequest()
    })
}

const title = import.meta.env.VITE_APP_NAME
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authV2LoginIllustrationDark"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <div class="d-flex justify-center">
            <VImg
              :src="logo"
              class="mb-6"
              max-width="80"
            />
          </div>
          <h4 class="text-h4 mb-1 text-center">
            Bem vindo ao <span class="text-capitalize">{{ title }}</span>! 👋🏻
          </h4>
          <p class="mb-0 text-center">
            Faça login em sua conta
          </p>
        </VCardText>

        <AlertDialog
          v-model:isDialogVisible="erros.erroDialog"
          :title="erros.erroStatus"
        />
        <VCardText>
          <VForm
            ref="form"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  autofocus
                  label="E-mail"
                  type="email"
                  placeholder="Insira seu E-mail"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Senha"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="credentials.remember"
                    label="Lembrar de mim"
                  />
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="loading"
                >
                  Entrar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
