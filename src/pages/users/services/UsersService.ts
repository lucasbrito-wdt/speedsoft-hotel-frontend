import ApiService from '@/services/ApiService'

class UsersService extends ApiService {
  async fetchRolesList<T>(): Promise<T> {
    return this.getOrDeleteRequest<T>('GET', undefined, 'listar/roles')
  }
}
export default new UsersService('usuarios')
