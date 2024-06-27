import ApiService from '@/services/ApiService';
class ApartamentoService extends ApiService {
    // 👉 methods
    async apartamentosCheckin() {
        return this.getOrDeleteRequest('GET', undefined, 'listar/apartamentosCheckin');
    }
    async interditarApartamento(id) {
        return this.postOrPutRequest('PUT', undefined, `alterar-status/3/${id}`);
    }
    async liberarApartamento(id) {
        return this.postOrPutRequest('PUT', undefined, `alterar-status/0/${id}`);
    }
}
export default new ApartamentoService('apartamento');
//# sourceMappingURL=ApartamentoService.js.map