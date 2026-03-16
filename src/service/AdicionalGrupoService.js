// src/service/AdicionalGrupoService.js

import {
    CustomError,
    HttpStatusCodes,
    messages
} from '../utils/helpers/index.js';
import AdicionalGrupoRepository from '../repository/AdicionalGrupoRepository.js';
import RestauranteRepository from '../repository/RestauranteRepository.js';
import PratoRepository from '../repository/PratoRepository.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';

class AdicionalGrupoService {
    constructor() {
        this.grupoRepository = new AdicionalGrupoRepository();
        this.restauranteRepository = new RestauranteRepository();
        this.pratoRepository = new PratoRepository();
        this.usuarioRepository = new UsuarioRepository();
    }

    async criar(parsedData, pratoId, req) {
        const prato = await this.pratoRepository.buscarPorID(pratoId);
        const restaurante = await this.restauranteRepository.buscarPorID(prato.restaurante_id);

        await this.verificarPermissaoDono(restaurante, req.user_id);

        parsedData.restaurante_id = prato.restaurante_id;

        const grupo = await this.grupoRepository.criar(parsedData);

        // Vincular grupo ao prato
        prato.adicionais_grupo_ids.push(grupo._id);
        await this.pratoRepository.atualizar(pratoId, { adicionais_grupo_ids: prato.adicionais_grupo_ids });

        return grupo;
    }

    async listar(restauranteId, req) {
        await this.restauranteRepository.buscarPorID(restauranteId);
        const data = await this.grupoRepository.listarPorRestaurante(restauranteId);
        return data;
    }

    async atualizar(id, parsedData, req) {
        const grupo = await this.grupoRepository.buscarPorID(id);
        const restaurante = await this.restauranteRepository.buscarPorID(grupo.restaurante_id);
        await this.verificarPermissaoDono(restaurante, req.user_id);
        const data = await this.grupoRepository.atualizar(id, parsedData);
        return data;
    }

    async deletar(id, req) {
        const grupo = await this.grupoRepository.buscarPorID(id);
        const restaurante = await this.restauranteRepository.buscarPorID(grupo.restaurante_id);
        await this.verificarPermissaoDono(restaurante, req.user_id);
        const data = await this.grupoRepository.deletar(id);
        return data;
    }

    async verificarPermissaoDono(restaurante, userId) {
        const usuario = await this.usuarioRepository.buscarPorID(userId);
        const isAdmin = usuario.isAdmin;
        const isDono = String(restaurante.dono_id._id || restaurante.dono_id) === String(userId);

        if (!isAdmin && !isDono) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Adicional',
                details: [],
                customMessage: "Você não tem permissões para gerenciar adicionais deste restaurante."
            });
        }
    }
}

export default AdicionalGrupoService;
