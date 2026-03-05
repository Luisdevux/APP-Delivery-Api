// src/service/UsuarioService.js

import {
    CustomError,
    HttpStatusCodes,
    messages,
    ensurePermission
} from '../utils/helpers/index.js';
import AuthHelper from '../utils/AuthHelper.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import { cpf, cnpj } from 'cpf-cnpj-validator';

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
    }

    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

    async criar(parsedData) {
        // Validar email único
        await this.validateEmail(parsedData.email);

        // Validar cpf_cnpj único se fornecido
        if (parsedData.cpf_cnpj) {
            await this.validateCpfCnpj(parsedData.cpf_cnpj);
        }

        // Hash da senha
        if (parsedData.senha) {
            parsedData.senha = await AuthHelper.hashPassword(parsedData.senha);
        }

        const data = await this.repository.criar(parsedData);
        return data;
    }

    async atualizar(id, parsedData, req) {
        // Não permitir alterar senha por esta rota
        delete parsedData.senha;

        await this.ensureUserExists(id);

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        const { isAdmin } = ensurePermission({
            usuarioLogado,
            targetId: id,
            field: 'Usuário',
            customMessage: 'Você não tem permissões para atualizar outro usuário.',
        });

        // Não permitir alterar isAdmin se não for admin
        if (!isAdmin) {
            delete parsedData.isAdmin;
        }

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async atualizarStatus(id, parsedData, req) {
        await this.ensureUserExists(id);

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        ensurePermission({
            usuarioLogado,
            targetId: id,
            field: 'Usuário',
            customMessage: 'Você não tem permissões para alterar o status deste usuário.',
        });

        const data = await this.repository.atualizar(id, { status: parsedData.status });
        return data;
    }

    async deletar(id, req) {
        await this.ensureUserExists(id);

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        ensurePermission({
            usuarioLogado,
            targetId: id,
            field: 'Usuário',
            customMessage: 'Você só pode deletar sua própria conta.',
        });

        const data = await this.repository.deletar(id);
        return data;
    }

    // ================================
    // MÉTODOS UTILITÁRIOS
    // ================================
    async validateEmail(email, id = null) {
        const usuarioExistente = await this.repository.buscarPorEmail(email, id);
        if (usuarioExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'email',
                details: [{ path: 'email', message: 'Email já está em uso.' }],
                customMessage: 'Email já cadastrado.',
            });
        }
    }

    async validateCpfCnpj(cpf_cnpj, id = null) {
      // Validar formato do CPF/CNPJ
      if (!this.isValidCpfCnpj(cpf_cnpj)) {
        throw new CustomError({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          errorType: 'validationError',
          field: 'cpf_cnpj',
          details: [{ path: 'cpf_cnpj', message: 'CPF/CNPJ inválido.' }],
          customMessage: 'CPF/CNPJ inválido.',
        });
      }

      // Validar se já existe
      const usuarioExistente = await this.repository.buscarPorCpfCnpj(cpf_cnpj, id);
      if (usuarioExistente) {
        throw new CustomError({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          errorType: 'validationError',
          field: 'cpf_cnpj',
          details: [{ path: 'cpf_cnpj', message: 'CPF/CNPJ já está em uso.' }],
          customMessage: 'CPF/CNPJ já cadastrado.',
        });
      }
    }

    isValidCpfCnpj(cpf_cnpj) {
      const cleaned = cpf_cnpj.replace(/\D/g, '');

      // CPF tem 11 dígitos, CNPJ tem 14
      if (cleaned.length === 11) {
        return cpf.isValid(cleaned);
      } else if (cleaned.length === 14) {
        return cnpj.isValid(cleaned);
      }
      return false;
    }

    async ensureUserExists(id) {
        const usuarioExistente = await this.repository.buscarPorID(id);
        if (!usuarioExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: 'Usuário não encontrado.'
            });
        }
        return usuarioExistente;
    }
}

export default UsuarioService;
