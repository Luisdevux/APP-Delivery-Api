import {
    CustomError,
    HttpStatusCodes,
    messages
} from '../utils/helpers/index.js';
import AvaliacaoRepository from '../repository/AvaliacaoRepository.js';
import PedidoRepository from '../repository/PedidoRepository.js';
import RestauranteRepository from '../repository/RestauranteRepository.js';
import NotificacaoRepository from '../repository/NotificacaoRepository.js';

class AvaliacaoService {
    constructor() {
        this.repository = new AvaliacaoRepository();
        this.pedidoRepository = new PedidoRepository();
        this.restauranteRepository = new RestauranteRepository();
        this.notificacaoRepository = new NotificacaoRepository();
    }

    async criar(parsedData, req) {
        const clienteId = req.user_id;
        const pedidoId = parsedData.pedido_id;

        // Verificar se o pedido existe e está entregue
        const pedido = await this.pedidoRepository.buscarPorID(pedidoId);

        if (String(pedido.cliente_id._id || pedido.cliente_id) !== String(clienteId)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Avaliação',
                details: [],
                customMessage: "Você não pode avaliar um pedido que não é seu."
            });
        }

        if (pedido.status !== 'entregue') {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'Avaliação',
                details: [],
                customMessage: 'Só é possível avaliar pedidos que já foram entregues.'
            });
        }

        // Verificar se já existe avaliação para este pedido
        const avaliacaoExistente = await this.repository.buscarPorPedidoId(pedidoId);
        if (avaliacaoExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.CONFLICT.code,
                errorType: 'duplicateError',
                field: 'Avaliação',
                details: [],
                customMessage: 'Este pedido já foi avaliado.'
            });
        }


    }
}
export default AvaliacaoService;
