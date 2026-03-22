import AvaliacaoService from '../service/AvaliacaoService.js';
import { AvaliacaoSchema } from '../utils/validators/schemas/zod/AvaliacaoSchema.js';
import { IdSchema } from '../utils/validators/schemas/zod/querys/CommonQuerySchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes
} from '../utils/helpers/index.js';

class AvaliacaoController {
    constructor() {
        this.service = new AvaliacaoService();
    }

    async listarPorRestaurante(req, res) {
        const { restauranteId } = req.params;
        IdSchema.parse(restauranteId);

        const data = await this.service.listarPorRestaurante(restauranteId, req);
        return CommonResponse.success(res, data);
    }
  async criar(req, res) {
        const parsedData = AvaliacaoSchema.parse(req.body);
        const data = await this.service.criar(parsedData, req);
        return CommonResponse.created(res, data);
    }
}

export default AvaliacaoController;