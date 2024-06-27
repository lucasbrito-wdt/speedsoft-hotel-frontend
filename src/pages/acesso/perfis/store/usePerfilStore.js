import { defineStore } from 'pinia';
import PerfisService from '@/pages/acesso/perfis/services/PerfisService';
import UsuarioService from '@/pages/users/services/UsersService';
import PermissoesService from '@/pages/acesso/permissoes/services/PermissoesService';
export const usePerfilStore = defineStore('perfil', {
    state: () => ({
        role: {},
        roles: [],
        permissions: [],
        users: [],
        loadingUsers: false,
        usersState: {},
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
        async cadastrarPerfil(role) {
            if (typeof role.permissions === 'string')
                role.permissions.push(role.permissions);
            return PerfisService.create(role)
                .then(data => {
                this.roles.push(data);
            });
        },
        async obterPerfil(id) {
            await PerfisService.fetch(id)
                .then(role => {
                const permissions = [];
                role.permissions.map(p => {
                    p.actions.map(action => {
                        permissions.push(action.id ?? '');
                    });
                });
                role.permissions = permissions;
                this.role = role;
            });
        },
        async atualizarPerfil(role) {
            return PerfisService.update(role, role.id ?? '')
                .then(data => {
                const index = this.roles.findIndex(r => r.id === data.id);
                console.log(index);
                if (index !== -1)
                    this.roles[index] = data;
            });
        },
        async deletarPerfil(id) {
            return PerfisService.destroy(id)
                .then(() => {
                const index = this.roles.findIndex(r => r.id === id);
                if (index !== -1)
                    this.roles.splice(index, 1);
            });
        },
        async listarPerfis() {
            PerfisService.fetchAll()
                .then(res => {
                this.roles = res.data;
            });
        },
        async listarTodasPermissions() {
            PermissoesService.listarTodasPermissoes()
                .then(res => {
                this.permissions = res;
            });
        },
        async filterUsuarios() {
            this.users = [];
            this.usersPage = 1;
            this.usersIsSearch = this.usersSearch.length > 0;
            this.usersState.loading();
            await this.listarUsuarios(this.usersState);
        },
        async clearFilterUsuarios() {
            this.users = [];
            this.usersPage = 1;
            this.usersIsSearch = false;
            this.usersSearch = '';
            this.usersState.loading();
            await this.listarUsuarios(this.usersState);
        },
        async listarUsuarios($state) {
            this.usersState = $state;
            this.loadingUsers = true;
            UsuarioService.fetchAll({
                page: this.usersPage,
                per_page: this.usersPerPage,
                search: this.usersSearch,
                sort_by: this.usersOrderBy.key,
                sort_order: this.usersOrderBy.order,
            })
                .then(res => {
                this.loadingUsers = false;
                if (res.data.length <= 0) {
                    $state.complete();
                }
                else {
                    if (this.usersPage === res.page)
                        this.users.push(...res.data);
                    $state.loaded();
                }
                this.usersPage = this.usersPage + 1;
            })
                .catch(() => {
                this.loadingUsers = false;
            });
        },
    },
    getters: {},
});
//# sourceMappingURL=usePerfilStore.js.map