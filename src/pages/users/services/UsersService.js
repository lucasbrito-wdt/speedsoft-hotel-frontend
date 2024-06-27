import ApiService from '@/services/ApiService';
class UsersService extends ApiService {
    async fetchRolesList() {
        return this.getOrDeleteRequest('GET', undefined, 'listar/roles');
    }
}
export default new UsersService('usuarios');
//# sourceMappingURL=UsersService.js.map