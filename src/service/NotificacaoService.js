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

    async criar(dadosNotificacao) {
        return await this.repository.criar(dadosNotificacao);
    }

    async buscarPorId(id, req) {
        if (!req.user_id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'Autenticação',
                details: [],
                customMessage: 'Usuário não autenticado.'
            });
        }

        const notificacao = await this.repository.buscarPorID(id);

        if (String(notificacao.usuario_id) !== String(req.user_id)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Notificação',
                details: [],
                customMessage: 'Você não tem permissão para acessar esta notificação.'
            });
        }

        return notificacao;
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

        const notificacao = await this.repository.buscarPorID(id);

        // Apenas o destinatário pode marcar a notificação como lida
        if (String(notificacao.usuario_id) !== String(req.user_id)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Notificação',
                details: [],
                customMessage: 'Você não tem permissão para marcar esta notificação como lida.'
            });
        }

        const updated = await this.repository.marcarComoLida(id);
        return updated;
    }

    async deletar(id, req) {
        if (!req.user_id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'Autenticação',
                details: [],
                customMessage: 'Usuário não autenticado. Faça login para deletar notificações.'
            });
        }

        const notificacao = await this.repository.buscarPorID(id);

        // Apenas o destinatário pode deletar sua notificação
        if (String(notificacao.usuario_id) !== String(req.user_id)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Notificação',
                details: [],
                customMessage: 'Você não tem permissão para deletar esta notificação.'
            });
        }

        return await this.repository.deletar(id);
    }
}

export default NotificacaoService;
