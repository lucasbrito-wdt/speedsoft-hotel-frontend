import ApiService from '@/services/ApiService'

class ApartamentoService extends ApiService {
  // 👉 methods
  public async apartamentosCheckin<T>() {
    return this.getOrDeleteRequest<T>('GET', undefined, 'listar/apartamentosCheckin')
  }

  public async interditarApartamento<T>(id: string) {
    return this.postOrPutRequest<T>('PUT', undefined, `alterar-status/3/${id}`)
  }

  public async liberarApartamento<T>(id: string) {
    return this.postOrPutRequest<T>('PUT', undefined, `alterar-status/0/${id}`)
  }
}
export default new ApartamentoService('apartamento')
