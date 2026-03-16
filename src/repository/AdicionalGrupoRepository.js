// src/repository/AdicionalGrupoRepository.js

import AdicionalGrupo from '../models/AdicionalGrupo.js';
import {
    CustomError,
    messages
} from '../utils/helpers/index.js';

class AdicionalGrupoRepository {
    constructor({ AdicionalGrupoModel = AdicionalGrupo } = {}) {
        this.modelAdicionalGrupo = AdicionalGrupoModel;
    }

    async buscarPorID(id) {
        const grupo = await this.modelAdicionalGrupo.findById(id);
        if (!grupo) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Grupo de Adicional',
                details: [],
                customMessage: messages.error.resourceNotFound('Grupo de Adicional')
            });
        }
        return grupo;
    }

    async listarPorRestaurante(restauranteId) {
        const grupos = await this.modelAdicionalGrupo.find({
            restaurante_id: restauranteId,
            ativo: true
        }).sort({ nome: 1 });
        return grupos;
    }

    async criar(dadosGrupo) {
        const grupo = new this.modelAdicionalGrupo(dadosGrupo);
        return await grupo.save();
    }

    async atualizar(id, parsedData) {
        const grupo = await this.modelAdicionalGrupo.findByIdAndUpdate(id, parsedData, { new: true });
        if (!grupo) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Grupo de Adicional',
                details: [],
                customMessage: messages.error.resourceNotFound('Grupo de Adicional')
            });
        }
        return grupo;
    }

    async deletar(id) {
        const grupo = await this.modelAdicionalGrupo.findByIdAndDelete(id);
        return grupo;
    }
}

export default AdicionalGrupoRepository;
