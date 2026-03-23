import Avaliacao from '../models/Avaliacao.js';
import {
    CustomError,
    messages
} from '../utils/helpers/index.js';

class AvaliacaoRepository {
    constructor({ AvaliacaoModel = Avaliacao } = {}) {
        this.modelAvaliacao = AvaliacaoModel;
    }

    async buscarPorID(id) {
        const avaliacao = await this.modelAvaliacao.findById(id)
            .populate('cliente_id', 'nome')
            .populate('restaurante_id', 'nome');
        if (!avaliacao) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Avaliação',
                details: [],
                customMessage: messages.error.resourceNotFound('Avaliação')
            });
        }
        return avaliacao;
    }

    async buscarPorPedidoId(pedidoId) {
        const avaliacao = await this.modelAvaliacao.findOne({ pedido_id: pedidoId });
        return avaliacao;
    }

    async listarPorRestaurante(restauranteId, req) {
        const { page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filtros = { restaurante_id: restauranteId };

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            populate: [
                { path: 'cliente_id', select: 'nome' }
            ],
            sort: { createdAt: -1 },
        };

        const resultado = await this.modelAvaliacao.paginate(filtros, options);
        resultado.docs = resultado.docs.map(doc => {
            return typeof doc.toObject === 'function' ? doc.toObject() : doc;
        });
        return resultado;
    }
}