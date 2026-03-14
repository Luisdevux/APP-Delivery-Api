import {
    CustomError,
    HttpStatusCodes,
    messages
} from '../utils/helpers/index.js';
import NotificacaoRepository from '../repository/NotificacaoRepository.js';

class NotificacaoService {
    constructor() {
        this.repository = new NotificacaoRepository();
    }

    async listarMinhasNotificacoes(req) {
        if (!req.user_id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'Autenticação',
                details: [],
                customMessage: 'Usuário não autenticado. Faça login para acessar as notificações.'
            });
        }

        return await this.repository.listar(req);
    }

    async marcarComoLida(id, req) {
        if (!req.user_id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'Autenticação',
                details: [],
                customMessage: 'Usuário não autenticado. Faça login para gerenciar notificações.'
            });
        }

 
}

export default NotificacaoService;
