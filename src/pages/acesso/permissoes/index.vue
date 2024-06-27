<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import AddEditPermissionDialog from './components/AddEditPermissionDialog.vue'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'
import { avatarCor } from '@/utils/formatters'
import type { IPermission } from '@/pages/acesso/types'

const permissoesStore = usePermissoesStore()
const { permissions, page, orderBy, sortBy, search, isSearch, itemsPerPage } = storeToRefs(permissoesStore)
const { listarPermissoes, obterPermission, deletarAllPermission, filtrarPermissoes, clearFilterPermissoes } = permissoesStore

// 👉 headers
const headers = [
  { title: 'Nome', key: 'title' },
  { title: '', key: 'permissions', sortable: false },
  { title: 'Data criação', key: 'created_at', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Data table options
const isEditing = ref<boolean>(false)
const isPermissionDialogVisible = ref(false)

const addPermission = () => {
  isPermissionDialogVisible.value = true
  isEditing.value = false
}

const editPermission = (permission: IPermission) => {
  isPermissionDialogVisible.value = true
  isEditing.value = true
  obterPermission(permission)
}

const deletePermission = (permission: IPermission) => {
  deletarAllPermission(permission, permission.actions.reduce((acc, item) => {
    acc.push(item.id)

    return acc
  }, []))
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h5 class="text-h4 mb-6">
        Lista de Permissões
      </h5>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'Todos' },
            ]"
            style="inline-size: 5rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField
              v-model="search"
              placeholder="Pesquisar"
              density="compact"
              style="inline-size: 12.5rem;"
              :append-inner-icon="isSearch ? 'tabler-x' : 'tabler-search'"
              @click:append-inner="isSearch ? clearFilterPermissoes() : filtrarPermissoes()"
            />
            <VBtn
              density="default"
              @click="addPermission"
            >
              Adicionar Permissão
            </VBtn>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          show-select
          :headers="headers"
          :items="permissions"
          class="text-no-wrap"
          @update:sort-by="(e) => {
            if (e.length > 0) {
              orderBy = e[0].key
              sortBy = e[0].order
            }
            else {
              orderBy = ''
              sortBy = ''
            }
            listarPermissoes()
          }"
        >
          <!-- Assigned To -->
          <template #item.permissions="{ item }">
            <div class="d-flex gap-2">
              <VChip
                v-for="text in item.actionsChip"
                :key="text"
                label
                :color="avatarCor[Math.floor(Math.random() * 6)]"
                class="font-weight-medium"
              >
                {{ text }}
              </VChip>
            </div>
          </template>

          <template #item.created_at="{ item }">
            <span>{{ item.created_at }}</span>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <VBtn
              icon
              size="small"
              color="medium-emphasis"
              variant="text"
              @click="editPermission(item)"
            >
              <VIcon
                size="22"
                icon="tabler-edit"
              />
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              color="medium-emphasis"
              @click="deletePermission(item)"
            >
              <VIcon
                size="22"
                icon="tabler-trash"
              />
            </VBtn>
          </template>

          <!-- pagination -->
          <template #bottom>
            <div class="d-flex justify-center">
              <InfiniteLoading @infinite="listarPermissoes">
                <template #complete>
                  <span>Não há mais resultados!</span>
                </template>
                <template #error>
                  <span>Ops, algo deu errado!</span>
                </template>
              </InfiniteLoading>
            </div>
          </template>
        </VDataTableServer>
      </VCard>

      <AddEditPermissionDialog
        v-model:isDialogVisible="isPermissionDialogVisible"
        v-model:isEditing="isEditing"
      />
    </VCol>
  </VRow>
</template>
