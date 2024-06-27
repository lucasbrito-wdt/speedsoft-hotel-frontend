<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { storeToRefs } from 'pinia'
import type { IRole } from '@/pages/acesso/types'
import { usePerfilStore } from '@/pages/acesso/perfis/store/usePerfilStore'

interface Props {
  roleId?: string
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:roleId', value: IRole): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const perfilStore = usePerfilStore()
const { cadastrarPerfil, obterPerfil, atualizarPerfil, listarTodasPermissions } = perfilStore
const { role, permissions } = storeToRefs(perfilStore)

const isSelectAll = ref(false)
const refPermissionForm = ref<VForm>()
const roleId = toRef(props, 'roleId')

const colSpan = computed(() => {
  let counter = 0

  permissions.value?.map(p => {
    if (p.actions?.length > counter)
      counter = p.actions.length
  })

  return counter
})

const onSubmit = () => {
  if (roleId.value?.length > 0)
    atualizarPerfil(role.value)
  else
    cadastrarPerfil(role.value)

  emit('update:roleId', '')
  emit('update:isDialogVisible', false)
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

watch(isSelectAll, val => {
  if (val) {
    permissions.value?.map(p => {
      p.actions?.map(action => {
        role.value.permissions.push(action.id)
      })
    })
  }
  else { role.value.permissions = [] }
})

watch(roleId, newRoleId => {
  obterPerfil(newRoleId)
})

onBeforeMount(() => {
  listarTodasPermissions()
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          {{ roleId ? 'Editar' : 'Criar' }} Perfil
        </VCardTitle>
        <p class="text-base mb-0">
          Escolha as permissões do perfil <strong> {{ role.title }}</strong>
        </p>
      </VCardItem>

      <VCardText class="mt-6">
        <VForm ref="refPermissionForm">
          <AppTextField
            v-model="role.title"
            label="Nome do Perfil"
            placeholder="Insira o nome do Perfil"
          />

          <h6 class="text-h4 mt-8 mb-3">
            Permissões do Perfil
          </h6>

          <VTable class="permission-table text-no-wrap">
            <tr>
              <td>
                Acesso Administrativo
              </td>
              <td :colspan="colSpan">
                <div class="d-flex justify-end">
                  <VCheckbox
                    v-model="isSelectAll"
                    label="Selecionar todos"
                  />
                </div>
              </td>
            </tr>

            <!-- 👉 Other permission loop -->
            <template
              v-for="permission in permissions"
              :key="permission.id"
            >
              <tr>
                <td>{{ permission.title }}</td>
                <td
                  v-for="(action, index) in permission.actions"
                  :key="index"
                >
                  <VCheckbox
                    v-model="role.permissions"
                    :label="action.title"
                    :value="action.id"
                  />
                </td>
              </tr>
            </template>
          </VTable>

          <!-- 👉 Actions button -->
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn @click="onSubmit">
              {{ roleId?.length > 0 ? 'Salvar' : 'Criar' }}
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="onReset"
            >
              Cancelar
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
