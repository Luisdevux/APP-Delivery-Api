import NotificacaoService from '../service/NotificacaoService.js';
import { IdSchema } from '../utils/validators/schemas/zod/querys/CommonQuerySchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes
} from '../utils/helpers/index.js';

class NotificacaoController {
    constructor() {
        this.service = new NotificacaoService();
    }

    async listarMinhas(req, res) {
        const data = await this.service.listarMinhasNotificacoes(req);
        return CommonResponse.success(res, data);
    }

    async marcarComoLida(req, res) {
        const { id } = req.params;
        IdSchema.parse(id);

        const data = await this.service.marcarComoLida(id, req);
        return CommonResponse.success(res, data, 200, 'Notificação marcada como lida.');
    }
}

export default NotificacaoController;