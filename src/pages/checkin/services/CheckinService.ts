import ApiService from '@/services/ApiService'

class CheckinService extends ApiService {
  // 👉 methods
  async fetchApartamento(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/apartamento')
  }

  async fetchEmpresa(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/empresa')
  }

  async fetchCliente(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/cliente')
  }
}
export default new CheckinService('checkin')
