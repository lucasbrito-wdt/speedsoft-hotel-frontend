import ApiService from '@/services/ApiService';
class PermissoesService extends ApiService {
    async listarTodasPermissoes() {
        return this.getOrDeleteRequest('GET', undefined, 'listar/todas');
    }
    async fetchActions() {
        return this.getOrDeleteRequest('GET', undefined, 'listar/acoes');
    }
    async deleteAll(data) {
        return this.postOrPutRequest('POST', {
            dados: data,
        }, 'remover/todas');
    }
}
export default new PermissoesService('permission');
//# sourceMappingURL=PermissoesService.js.map