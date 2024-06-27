import { defineStore } from 'pinia';
import PermissoesService from '@/pages/acesso/permissoes/services/PermissoesService';
export const usePermissoesStore = defineStore('permissoes', {
    state: () => ({
        permissions: [],
        permission: {
            id: '',
            name: '',
            title: '',
            actions: [],
        },
        actions: [],
        permissionsState: {},
        page: 1,
        itemsPerPage: 15,
        orderBy: 'title',
        sortBy: 'asc',
        search: '',
        isSearch: false,
    }),
    actions: {
        async listarPermissoes($state) {
            if ($state)
                this.permissionsState = $state;
            PermissoesService.fetchAll({
                page: this.page,
                per_page: this.itemsPerPage,
                search: this.search,
                sort_by: this.orderBy,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                sort_order: this.sortBy,
            })
                .then(permissions => {
                if (permissions.data.length <= 0) {
                    this.permissionsState.complete();
                }
                else {
                    if (this.page === permissions.page) {
                        // eslint-disable-next-line array-callback-return
                        permissions.data.map(p => {
                            p.actionsChip = p.actions.reduce((actions, item) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                actions.push(item.title);
                                return actions;
                            }, []);
                        });
                        this.permissions.push(...permissions.data);
                    }
                    this.permissionsState.loaded();
                }
                this.page = this.page + 1;
            });
        },
        async filtrarPermissoes() {
            this.permissions = [];
            this.page = 1;
            this.permissionsState.loading();
            this.isSearch = true;
            await this.listarPermissoes(this.permissionsState);
        },
        async clearFilterPermissoes() {
            this.permissions = [];
            this.page = 1;
            this.isSearch = false;
            this.search = '';
            this.permissionsState.loading();
            await this.listarPermissoes(this.permissionsState);
        },
        async obterPermission(permission) {
            this.permission = {
                ...permission,
            };
        },
        async cadastrarPermission(permission) {
            return PermissoesService.create(permission)
                .then(data => {
                data.actionsChip = data.actions.reduce((actions, item) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    actions.push(item.title);
                    return actions;
                }, []);
                this.permissions.push(data);
            });
        },
        async atualizarPermission(permission) {
            return PermissoesService.update(permission, 'updateAll')
                .then(data => {
                const index = this.permissions.findIndex(p => p.id === data.id);
                if (index !== -1) {
                    data.actionsChip = data.actions.reduce((actions, item) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        actions.push(item.title);
                        return actions;
                    }, []);
                    this.permissions[index] = data;
                }
            });
        },
        async deletarAllPermission(permission, data) {
            return PermissoesService.deleteAll(data)
                .then(() => {
                const index = this.permissions.findIndex(p => p === permission);
                if (index !== -1)
                    this.permissions.splice(index, 1);
            });
        },
        async listarActions() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            PermissoesService.fetchActions()
                .then(actions => {
                this.actions = actions;
            });
        },
    },
    getters: {},
});
//# sourceMappingURL=usePermissoesStore.js.map