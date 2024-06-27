import { defineStore } from 'pinia'
import type { VForm } from 'vuetify/components/VForm'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import { handleError } from '@/services/error-handling'
import type { IItemsResponse, IUser } from '@/pages/users/types'
import type { IRole, IRoleResponse } from '@/pages/acesso/types'
import UsersService from '@/pages/users/services/UsersService'
import type { ISearch } from '@/components/CDF/SearchBar.vue'
import type { IOrderBy } from '@/pages/types/layoutTable.types'

const defaultValue = {
  id: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  foto: '',
  role: {
    title: '',
    value: '',
  },
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    // Form
    form: undefined as VForm | undefined,
    data: { ...defaultValue } as IUser,
    roles: [] as IRole[],

    // List
    items: [] as IUser[],
    itemsPerPage: 10,
    page: 1,
    totalItems: 0,
    orderBy: {
      key: 'name',
      order: 'asc',
    } as IOrderBy,

    // Search
    isSearching: false,
    searchTerm: {
      field: '',
      search: '',
      relationship: '',
    } as ISearch,
    searchPage: 1,

    // Generic
    confirmDestroyItem: false,
    destroyId: '',
    messages: {
      success: {
        isSuccess: false,
        message: '',
      },
      error: {
        isError: false,
        status: '',
        messages: [] as any[] | string,
      },
    },
    loading: {
      roles: false,
      save: false,
      item: false,
      items: false,
      destroy: false,
    },
  }),
  actions: {
    async loadMore(state: StateHandler) {
      if (this.isSearching)
        await this.search(state)
      else
        await this.fetchItems(state)
    },
    async fetchItems(state: StateHandler) {
      if (this.isSearching) {
        this.items = []
        this.totalItems = 0
        this.page = 1
      }

      if (this.page === 1)
        this.loading.items = true

      this.isSearching = false

      await UsersService.fetchAll<IItemsResponse>({
        page: this.page,
        sort_by: this.orderBy.key,
        sort_order: this.orderBy.order,
      })
        .then(res => {
          if (res.data.length === 0) {
            state.complete()
          }
          else {
            this.items.push(...res.data)
            state.loaded()
          }
          this.totalItems = res.total
          this.page = res.page + 1
          this.loading.items = false
        }).catch(() => {
          this.items = []
          this.loading.items = false
        })
    },
    async fetchItem(id: string) {
      this.loading.item = true

      // fetch item
      UsersService.fetch<IUser>(id)
        .then(item => {
          this.data = item
          this.loading.item = false
        }).catch(() => {
          this.loading.item = false
        })
    },
    async save() {
      // save item
      this.loading.save = true
      await UsersService.create(this.data)
        .then(() => {
          this.messages.success.isSuccess = true
          this.messages.success.message = 'Usuário criado com sucesso!'

          this.loading.save = false
          this.resetForm()
        }).catch(error => {
          this.loading.save = false

          const handling = handleError(error.response)

          this.messages.error.isError = true
          this.messages.error.status = handling?.erroStatus
          this.messages.error.messages = handling?.errors
        })
    },
    async update() {
      // update item
      if (this.data.password === '' || this.data.password === null || this.data.password === undefined)
        delete this.data.password

      if (this.data.password_confirmation === '' || this.data.password_confirmation === null || this.data.password_confirmation === undefined)
        delete this.data.password_confirmation

      this.loading.save = true
      if (this.data.id) {
        UsersService.update(this.data, this.data.id)
          .then(() => {
            this.messages.success.isSuccess = true
            this.messages.success.message = 'Usuário atualizado com sucesso!'
            this.loading.save = false
          }).catch(error => {
            this.loading.save = false

            const handling = handleError(error.response)

            this.messages.error.isError = true
            this.messages.error.status = handling?.erroStatus
            this.messages.error.messages = handling?.errors
          })
      }
    },
    async destroy() {
      // delete item
      this.loading.destroy = true
      UsersService.destroy(this.destroyId)
        .then(() => {
          const index = this.items.findIndex(item => item.id === this.destroyId)

          this.items.splice(index, 1)

          this.messages.success.isSuccess = true
          this.messages.success.message = 'Usuário excluído com sucesso!'
          this.loading.destroy = false
          this.confirmDestroyItem = false
        }).catch(() => {
          this.loading.destroy = false
        })
    },
    async dialogDestroy(id: string) {
      this.confirmDestroyItem = true
      this.destroyId = id
    },
    async search(state: StateHandler) {
      if (!this.isSearching) {
        this.items = []
        this.totalItems = 0
        this.searchPage = 1
      }

      if (this.searchPage === 1)
        this.loading.items = true

      this.isSearching = true

      // search item
      if (this.searchTerm.field && this.searchTerm.search) {
        await UsersService.search<IItemsResponse>(this.searchTerm.field, this.searchTerm.search, this.searchPage, this.searchTerm.relationship, this.orderBy)
          .then(res => {
            if (res.data.length === 0) {
              state.complete()
            }
            else {
              this.items.push(...res.data)
              state.loaded()
            }
            this.totalItems = res.total
            this.searchPage = res.page + 1
            this.loading.items = false
          }).catch(() => {
            this.items = []
            this.loading.items = false
          })
      }
    },
    async onOrderBy(state: StateHandler, value: IOrderBy[]) {
      // set order by
      this.orderBy = value.length > 0
        ? { key: value[0].key, order: value[0].order }
        : { key: 'name', order: 'asc' }

      this.items = []
      this.searchPage = 1
      this.page = 1
      this.loading.items = false

      await this.loadMore(state)
    },

    async fetchPerfis() {
      this.loading.roles = true
      await UsersService.fetchRolesList<IRoleResponse>()
        .then(res => {
          this.roles = res.data
          this.loading.roles = false
        }).catch(() => {
          this.roles = []
          this.loading.roles = false
        })
    },
    resetMessages() {
      // reset messages
      this.messages = {
        success: {
          isSuccess: false,
          message: '',
        },
        error: {
          isError: false,
          status: '',
          messages: [],
        },
      }
    },
    resetForm() {
      // reset form
      this.form?.reset()
      this.form?.resetValidation()
      this.$reset()
      this.data = { ...defaultValue }
      this.resetMessages()
    },
    resetSearch(state: StateHandler) {
      // reset search
      this.searchTerm = {
        field: '',
        search: '',
        relationship: '',
      }
      this.searchPage = 1
      this.isSearching = false

      // reset fetch
      this.page = 1
      this.items = []

      // fetch
      this.fetchItems(state)
    },
    searchAgain(state: StateHandler) {
      this.items = []
      this.searchPage = 1

      this.search(state)
    },
  },
})