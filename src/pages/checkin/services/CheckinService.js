import ApiService from '@/services/ApiService';
class CheckinService extends ApiService {
    // 👉 methods
    async fetchApartamento(search) {
        return await this.getOrDeleteRequest('GET', {
            search,
        }, 'listar/apartamento');
    }
    async fetchEmpresa(search) {
        return await this.getOrDeleteRequest('GET', {
            search,
        }, 'listar/empresa');
    }
    async fetchCliente(search) {
        return await this.getOrDeleteRequest('GET', {
            search,
        }, 'listar/cliente');
    }
}
export default new CheckinService('checkin');
//# sourceMappingURL=CheckinService.js.map