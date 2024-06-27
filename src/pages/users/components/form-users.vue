<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import { confirmedValidator, emailValidator, requiredValidator } from '@/validators/cdf-rules'
import type { IUser } from '@/pages/users/types'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
}>(), {
  isEditing: false,
})

const store = useUsersStore()
const user = useLocalStorage<IUser>('userData', {} as IUser)

const {
  form,
  data,
  roles,
  loading,
  messages,
} = storeToRefs(store)

const {
  fetchPerfis,
  save,
  update,
  resetForm,
} = store

onMounted(async () => {
  await fetchPerfis()
})

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    v-model:messages="messages"
    :title="!isEditing ? $t('users.register') : $t('users.edit')"
    :is-editing="isEditing"
    :actions="{
      save: {
        method: () => save(),
      },
      update: {
        method: () => update(),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/users"
  >
    <template #content>
      <VCol
        cols="12"
        class="d-flex justify-center"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="avatar"
        >
          <EnviarImagem v-model="data.foto" />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <AppTextField
            v-model="data.name"
            :label="$t('users.form.name.label')"
            :placeholder="$t('users.form.name.placeholder')"
            :rules="[requiredValidator]"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <AppAutocomplete
            v-if="!isEditing || user.role.value === 'admin'"
            v-model="data.role"
            :label="$t('users.form.role.label')"
            :placeholder="$t('users.form.role.placeholder')"
            :rules="[requiredValidator]"
            item-value="value"
            item-title="title"
            :items="roles"
            :loading="loading.roles"
            return-object
          />
          <AppTextField
            v-else
            :model-value="data?.role?.title"
            label="Cargo"
            disabled
            readonly
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol cols="12">
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.email"
            :label="$t('users.form.email.label')"
            :placeholder="$t('users.form.email.placeholder')"
            :rules="[requiredValidator, emailValidator]"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.password"
            :label="$t('users.form.password.label')"
            :placeholder="$t('users.form.password.placeholder')"
            :rules="isEditing ? [] : [requiredValidator]"
            type="password"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.password_confirmation"
            :label="$t('users.form.password_confirmation.label')"
            :placeholder="$t('users.form.password_confirmation.placeholder')"
            :rules="isEditing ? [] : [requiredValidator, confirmedValidator(data.password, data.password_confirmation)]"
            type="password"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>
    </template>
  </LayoutForms>
</template>
