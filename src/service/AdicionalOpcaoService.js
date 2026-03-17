// src/service/AdicionalOpcaoService.js

import { ensurePermission } from '../utils/helpers/index.js';
import AdicionalOpcaoRepository from '../repository/AdicionalOpcaoRepository.js';
import AdicionalGrupoRepository from '../repository/AdicionalGrupoRepository.js';
import RestauranteRepository from '../repository/RestauranteRepository.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';

class AdicionalOpcaoService {
    constructor() {
        this.opcaoRepository = new AdicionalOpcaoRepository();
        this.grupoRepository = new AdicionalGrupoRepository();
        this.restauranteRepository = new RestauranteRepository();
        this.usuarioRepository = new UsuarioRepository();
    }

    async criar(parsedData, req) {
        const grupoId = parsedData.grupo_id;
        const grupo = await this.grupoRepository.buscarPorID(grupoId);
        const restaurante = await this.restauranteRepository.buscarPorID(grupo.restaurante_id);

        const usuarioLogado = await this.usuarioRepository.buscarPorID(req.user_id);
        const donoId = String(restaurante.dono_id._id || restaurante.dono_id);
        ensurePermission({
            usuarioLogado,
            targetId: donoId,
            field: 'Adicional',
            customMessage: 'Você não tem permissões para gerenciar adicionais deste restaurante.',
        });

        const opcao = await this.opcaoRepository.criar(parsedData);
        return opcao;
    }

    async listar(grupoId) {
        await this.grupoRepository.buscarPorID(grupoId);
        const data = await this.opcaoRepository.listarPorGrupo(grupoId);
        return data;
    }

    async atualizar(id, parsedData, req) {
        const opcao = await this.opcaoRepository.buscarPorID(id);
        const grupo = await this.grupoRepository.buscarPorID(opcao.grupo_id);
        const restaurante = await this.restauranteRepository.buscarPorID(grupo.restaurante_id);

        const usuarioLogado = await this.usuarioRepository.buscarPorID(req.user_id);
        const donoId = String(restaurante.dono_id._id || restaurante.dono_id);
        ensurePermission({
            usuarioLogado,
            targetId: donoId,
            field: 'Adicional',
            customMessage: 'Você não tem permissões para editar adicionais deste restaurante.',
        });

        const data = await this.opcaoRepository.atualizar(id, parsedData);
        return data;
    }

    async deletar(id, req) {
        const opcao = await this.opcaoRepository.buscarPorID(id);
        const grupo = await this.grupoRepository.buscarPorID(opcao.grupo_id);
        const restaurante = await this.restauranteRepository.buscarPorID(grupo.restaurante_id);

        const usuarioLogado = await this.usuarioRepository.buscarPorID(req.user_id);
        const donoId = String(restaurante.dono_id._id || restaurante.dono_id);
        ensurePermission({
            usuarioLogado,
            targetId: donoId,
            field: 'Adicional',
            customMessage: 'Você não tem permissões para excluir adicionais deste restaurante.',
        });

        const data = await this.opcaoRepository.deletar(id);
        return data;
    }
}

export default AdicionalOpcaoService;
