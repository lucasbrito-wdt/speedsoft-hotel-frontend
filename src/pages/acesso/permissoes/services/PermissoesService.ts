import ApiService from '@/services/ApiService'
import type { IAction } from '@/pages/acesso/types'

class PermissoesService extends ApiService {
  async listarTodasPermissoes<T>() {
    return this.getOrDeleteRequest<T>('GET', undefined, 'listar/todas')
  }

  async fetchActions() {
    return this.getOrDeleteRequest<IAction[]>('GET', undefined, 'listar/acoes')
  }

  async deleteAll(data: string[]) {
    return this.postOrPutRequest('POST', {
      dados: data,
    }, 'remover/todas')
  }
}
export default new PermissoesService('permission')
