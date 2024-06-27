import { defineStore } from 'pinia'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import PerfisService from '@/pages/acesso/perfis/services/PerfisService'
import type { IPermission, IRole, IRoleResponse, IUsuarioResponse } from '@/pages/acesso/types'
import type { IUsuario } from '@/pages/usuario/types'
import UsuarioService from '@/pages/users/services/UsersService'
import PermissoesService from '@/pages/acesso/permissoes/services/PermissoesService'

export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    role: {} as IRole,
    roles: [] as IRole[],
    permissions: [] as IPermission[],

    users: [] as IUsuario[],
    loadingUsers: false,

    usersState: {} as StateHandler,
    usersPage: 1,
    usersPerPage: 15,
    usersOrderBy: {
      key: 'name',
      order: 'asc',
    },
    usersSearch: '',
    usersIsSearch: false,
  }),
  actions: {
    async cadastrarPerfil(role: IRole) {
      if (typeof role.permissions === 'string')
        role.permissions.push(role.permissions)

      return PerfisService.create<IRole>(role)
        .then(data => {
          this.roles.push(data)
        })
    },
    async obterPerfil(id: string) {
      await PerfisService.fetch<IRole>(id)
        .then(role => {
          const permissions: string[] = []

          role.permissions.map(p => {
            p.actions.map(action => {
              permissions.push(action.id ?? '')
            })
          })

          role.permissions = permissions

          this.role = role
        })
    },
    async atualizarPerfil(role: IRole) {
      return PerfisService.update<IRole>(role, role.id ?? '')
        .then(data => {
          const index = this.roles.findIndex(r => r.id === data.id)

          console.log(index)
          if (index !== -1)
            this.roles[index] = data
        })
    },
    async deletarPerfil(id: string) {
      return PerfisService.destroy<IRole>(id)
        .then(() => {
          const index = this.roles.findIndex(r => r.id === id)

          if (index !== -1)
            this.roles.splice(index, 1)
        })
    },
    async listarPerfis() {
      PerfisService.fetchAll<IRoleResponse>()
        .then(res => {
          this.roles = res.data
        })
    },
    async listarTodasPermissions() {
      PermissoesService.listarTodasPermissoes<IPermission[]>()
        .then(res => {
          this.permissions = res
        })
    },
    async filterUsuarios() {
      this.users = []
      this.usersPage = 1
      this.usersIsSearch = this.usersSearch.length > 0
      this.usersState.loading()
      await this.listarUsuarios(this.usersState)
    },
    async clearFilterUsuarios() {
      this.users = []
      this.usersPage = 1
      this.usersIsSearch = false
      this.usersSearch = ''
      this.usersState.loading()
      await this.listarUsuarios(this.usersState)
    },
    async listarUsuarios($state: StateHandler) {
      this.usersState = $state
      this.loadingUsers = true

      UsuarioService.fetchAll<IUsuarioResponse>({
        page: this.usersPage,
        per_page: this.usersPerPage,
        search: this.usersSearch,
        sort_by: this.usersOrderBy.key,
        sort_order: this.usersOrderBy.order,
      })
        .then(res => {
          this.loadingUsers = false

          if (res.data.length <= 0) {
            $state.complete()
          }
          else {
            if (this.usersPage === res.page)
              this.users.push(...res.data)
            $state.loaded()
          }
          this.usersPage = this.usersPage + 1
        })
        .catch(() => {
          this.loadingUsers = false
        })
    },
  },
  getters: {
  },
})
