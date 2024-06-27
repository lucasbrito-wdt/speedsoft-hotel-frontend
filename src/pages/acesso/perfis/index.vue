<script setup lang="ts">
import RoleCards from './components/RoleCards.vue'
import UserList from './components/UserList.vue'
import { usePerfilStore } from '@/pages/acesso/perfis/store/usePerfilStore'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'

const perfilStore = usePerfilStore()
const permissoesStore = usePermissoesStore()

const { listarPerfis } = perfilStore
const { listarPermissoes } = permissoesStore

definePage({
  meta: {
    unauthenticatedOnly: false,
    action: 'manage',
    subject: 'all',
  },
})

onBeforeMount(() => {
  Promise.all([
    listarPerfis(),
    listarPermissoes(),
  ])
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Lista de perfis
      </h4>
      <p class="mb-0">
        Um perfil dá acesso a menus e recursos pré-definidos, de modo que, dependendo do perfil atribuído, um administrador pode acessar o que precisa.
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <RoleCards />
    </VCol>

    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Total de usuários com suas funções
      </h4>
      <p class="mb-0">
        Encontre todas as contas de administrador da sua empresa e suas funções de associado.
      </p>
    </VCol>

    <VCol cols="12">
      <!-- 👉 User List  -->
      <UserList />
    </VCol>
  </VRow>
</template>
