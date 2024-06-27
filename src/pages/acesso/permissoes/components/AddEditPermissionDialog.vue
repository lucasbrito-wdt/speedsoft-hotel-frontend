<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VForm } from 'vuetify/components/VForm'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'

interface Props {
  isDialogVisible: boolean
  isEditing: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:isEditing', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const permissoesStore = usePermissoesStore()
const { listarActions, cadastrarPermission, atualizarPermission } = permissoesStore
const { permission, actions } = storeToRefs(permissoesStore)
const isEditing = toRef(props, 'isEditing')

const isSelectAll = ref(false)
const refPermissionForm = ref<VForm>()

const trActions = computed(() => {
  const divided = []
  for (let i = 0; i < actions.value.length; i += 4)
    divided.push(actions.value.slice(i, i + 4))

  return divided
})

const addDeletedAction = (id: string) => {
  permission.value?.actionsDelete?.push(id)
}

const removeDeletedAction = (index: string) => {
  permission.value?.actionsDelete?.splice(index, 1)
}

const changeDeleted = (id: string) => {
  if (isEditing) {
    const action = permission.value?.actionsAdded?.find(p => p.action === id)
    const findIndex = permission.value?.actionsDelete?.findIndex(p => p === action.id)

    console.log(findIndex, action)

    if (findIndex === -1) {
      if (action)
        addDeletedAction(action.id)
    }
    else {
      removeDeletedAction(findIndex)
    }

    if (!action)
      permission.value?.actionsAdding?.push(id)
  }
}

watch(isSelectAll, val => {
  if (val) {
    actions.value.map(p => {
      permission.value?.actions?.push(p.id)
    })
  }
  else { permission.value.actions = [] }
})

watch(isEditing, val => {
  if (val) {
    permission.value.name = permission.value.subject
    permission.value.actionsDelete = []
    permission.value.actionsAdding = []
    permission.value.actionsAdded = permission.value.actions.reduce((acc, p) => {
      acc.push({
        id: p.id,
        action: p.action,
      })

      return acc
    }, [])

    permission.value.actions = permission.value.actions.reduce((acc, p) => {
      acc.push(p.action)

      return acc
    }, [])
  }
})

const onSubmit = () => {
  if (isEditing.value)
    atualizarPermission(permission.value)
  else
    cadastrarPermission(permission.value)

  emit('update:isDialogVisible', false)
  emit('update:isEditing', false)

  permission.value = {
    title: '',
    name: '',
    actions: [],
  }
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  emit('update:isEditing', false)

  permission.value = {
    title: '',
    name: '',
    actions: [],
  }
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

onBeforeMount(() => {
  listarActions()
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5">
          {{ isEditing ? 'Editar' : 'Criar' }} Permissão
        </VCardTitle>
        <VCardSubtitle>
          {{ isEditing ? 'Edite' : 'Crie' }}  Permissões conforme suas necessidades.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="mt-1">
        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <VAlert
            type="warning"
            title="Aviso!"
            variant="tonal"
            class="mb-6"
          >
            Ao editar o nome da permissão, você pode comprometer a funcionalidade das permissões do sistema. Por favor, certifique-se de ter absoluta certeza antes de prosseguir.
          </VAlert>

          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="permission.title"
                density="compact"
                label="Nome do Crud"
                placeholder="Insira o nome do crud"
              />
            </VCol>

            <VCol cols="12">
              <AppTextField
                v-model="permission.name"
                density="compact"
                label="Nome do Assunto"
                placeholder="Insira o nome do assunto"
              />
            </VCol>

            <VTable class="w-100">
              <thead>
                <tr>
                  <th :colspan="actions?.length">
                    <VRow align="center">
                      <span>Ações</span>
                      <VSpacer />
                      <VCheckbox
                        v-model="isSelectAll"
                        label="Selecionar todos"
                      />
                    </VRow>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(trs, trIndex) in trActions"
                  :key="trIndex"
                >
                  <td v-for="(td, tdIndex) in trs">
                    <VCheckbox
                      :key="tdIndex"
                      v-model="permission.actions"
                      :label="td.title"
                      :value="td.id"
                      @change="() => changeDeleted(td.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>

            <!-- 👉 Submit and Cancel -->
            <VCol cols="12">
              <VBtn
                class="me-3"
                @click="onSubmit"
              >
                Salvar
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="onReset"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
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
    padding-inline: 0;
  }
}
</style>
