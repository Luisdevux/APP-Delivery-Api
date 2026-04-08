import AdicionalGrupoController from '../../controllers/AdicionalGrupoController.js';
import AdicionalGrupoService from '../../service/AdicionalGrupoService.js';
import {
    AdicionalGrupoSchema,
    AdicionalGrupoUpdateSchema
} from '../../utils/validators/schemas/zod/AdicionalSchema.js';
import { IdSchema } from '../../utils/validators/schemas/zod/querys/CommonQuerySchema.js';
import { CommonResponse, HttpStatusCodes, CustomError } from '../../utils/helpers/index.js';

jest.mock('../../service/AdicionalGrupoService.js');
jest.mock('../../utils/validators/schemas/zod/AdicionalSchema.js');
jest.mock('../../utils/validators/schemas/zod/querys/CommonQuerySchema.js');
jest.mock('../../utils/helpers/index.js');

describe('Controller: AdicionalGrupoController', () => {
    let controller;
    let mockService;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        jest.clearAllMocks();

        mockService = {
            listarPorPrato: jest.fn(),
            buscarPorID: jest.fn(),
            criar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
        };

        AdicionalGrupoService.mockImplementation(() => mockService);

        mockRequest = {
            params: {},
            body: {},
            user_id: 'user-123',
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        controller = new AdicionalGrupoController();

        CommonResponse.success = jest.fn().mockReturnValue(mockResponse);
        CommonResponse.created = jest.fn().mockReturnValue(mockResponse);

        AdicionalGrupoSchema.parse = jest.fn((data) => data);
        AdicionalGrupoUpdateSchema.parse = jest.fn((data) => data);
        IdSchema.parse = jest.fn((data) => data);
    });


    describe('listarPorPrato', () => {
        it('deve listar adicionais por prato com sucesso', async () => {
            const pratoId = 'prato-123';
            const mockData = [
                { _id: '1', nome: 'Grupo 1', restaurante_id: 'rest-123' },
                { _id: '2', nome: 'Grupo 2', restaurante_id: 'rest-123' },
            ];

            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue(mockData);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(pratoId);
            expect(mockService.listarPorPrato).toHaveBeenCalledWith(pratoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, mockData);
        });

        it('deve retornar vazio quando não há adicionais', async () => {
            const pratoId = 'prato-456';
            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue([]);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(mockService.listarPorPrato).toHaveBeenCalledWith(pratoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, []);
        });

        it('deve lançar erro ao validar pratoId inválido', async () => {
            const error = new CustomError({ statusCode: 400, errorType: 'invalidInput' });
            IdSchema.parse.mockImplementation(() => {
                throw error;
            });

            mockRequest.params = { pratoId: 'invalid' };

            await expect(controller.listarPorPrato(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });

    describe('buscarPorID', () => {
        it('deve buscar um grupo por ID com sucesso', async () => {
            const grupoId = 'grupo-123';
            const mockData = {
                _id: grupoId,
                nome: 'Bebidas',
                restaurante_id: 'rest-123',
                tipo: 'adicional',
            };

            mockRequest.params = { id: grupoId };
            mockService.buscarPorID.mockResolvedValue(mockData);

            await controller.buscarPorID(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(grupoId);
            expect(mockService.buscarPorID).toHaveBeenCalledWith(grupoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, mockData);
        });

        it('deve lançar erro quando grupo não existe', async () => {
            const grupoId = 'grupo-inexistente';
            const error = new CustomError({ statusCode: 404, errorType: 'resourceNotFound' });
            IdSchema.parse.mockReturnValue(grupoId);
            mockService.buscarPorID.mockRejectedValue(error);

            mockRequest.params = { id: grupoId };

            await expect(controller.buscarPorID(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });

    describe('criar', () => {
        it('deve criar um novo grupo de adicional', async () => {
            const parsedData = {
                nome: 'Bebidas',
                tipo: 'adicional',
                obrigatorio: false,
                prato_id: 'prato-123'
            };

            const mockGrupo = {
                _id: 'grupo-123',
                nome: 'Bebidas',
                restaurante_id: 'rest-123',
                tipo: 'adicional',
            };

            AdicionalGrupoSchema.parse.mockReturnValue(parsedData);
            mockService.criar.mockResolvedValue(mockGrupo);

            mockRequest.body = parsedData;

            await controller.criar(mockRequest, mockResponse);

            expect(AdicionalGrupoSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(mockService.criar).toHaveBeenCalled();
            expect(CommonResponse.created).toHaveBeenCalledWith(mockResponse, mockGrupo);
        });

        it('deve lançar erro ao validar dados inválidos', async () => {
            const error = new CustomError({ statusCode: 400, errorType: 'invalidInput' });
            AdicionalGrupoSchema.parse.mockImplementation(() => {
                throw error;
            });

            mockRequest.body = { nome: '' };

            await expect(controller.criar(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });

    describe('atualizar', () => {
        it('deve atualizar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const updateData = {
                nome: 'Bebidas Premium',
            };

            const mockGrupoAtualizado = {
                _id: grupoId,
                nome: 'Bebidas Premium',
                restaurante_id: 'rest-123',
                tipo: 'adicional',
            };

            AdicionalGrupoUpdateSchema.parse.mockReturnValue(updateData);
            mockService.atualizar.mockResolvedValue(mockGrupoAtualizado);
            CommonResponse.success.mockReturnValue(mockResponse);

            mockRequest.params = { id: grupoId };
            mockRequest.body = updateData;

            await controller.atualizar(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(grupoId);
            expect(AdicionalGrupoUpdateSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(mockService.atualizar).toHaveBeenCalledWith(grupoId, updateData, mockRequest);
            expect(CommonResponse.success).toHaveBeenCalled();
        });

        it('deve lançar erro ao atualizar com dados inválidos', async () => {
            const error = new CustomError({ statusCode: 400, errorType: 'invalidInput' });
            AdicionalGrupoUpdateSchema.parse.mockImplementation(() => {
                throw error;
            });

            mockRequest.params = { id: 'grupo-123' };
            mockRequest.body = {};

            await expect(controller.atualizar(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });

    describe('deletar', () => {
        it('deve deletar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const mockGrupoDeletado = {
                _id: grupoId,
                nome: 'Bebidas',
            };

            mockService.deletar.mockResolvedValue(mockGrupoDeletado);
            CommonResponse.success.mockReturnValue(mockResponse);

            mockRequest.params = { id: grupoId };

            await controller.deletar(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(grupoId);
            expect(mockService.deletar).toHaveBeenCalledWith(grupoId, mockRequest);
            expect(CommonResponse.success).toHaveBeenCalled();
        });

        it('deve lançar erro ao deletar grupo inexistente', async () => {
            const grupoId = 'grupo-inexistente';
            const error = new CustomError({ statusCode: 404, errorType: 'resourceNotFound' });

            mockService.deletar.mockRejectedValue(error);

            mockRequest.params = { id: grupoId };

            await expect(controller.deletar(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });
});
