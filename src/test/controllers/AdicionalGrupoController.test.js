import AdicionalGrupoController from '../../controllers/AdicionalGrupoController.js';
import AdicionalGrupoService from '../../service/AdicionalGrupoService.js';
import { CommonResponse, HttpStatusCodes, CustomError } from '../../utils/helpers/index.js';
import * as AdicionalSchema from '../../utils/validators/schemas/zod/AdicionalSchema.js';
import * as CommonQuerySchema from '../../utils/validators/schemas/zod/querys/CommonQuerySchema.js';

jest.mock('../../service/AdicionalGrupoService.js');
jest.mock('../../utils/helpers/index.js');
jest.mock('../../utils/validators/schemas/zod/AdicionalSchema.js');
jest.mock('../../utils/validators/schemas/zod/querys/CommonQuerySchema.js');

describe('AdicionalGrupoController', () => {
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

        CommonResponse.success = jest.fn();
        CommonResponse.created = jest.fn();

        AdicionalSchema.AdicionalGrupoSchema = {
            parse: jest.fn((data) => data),
        };

        AdicionalSchema.AdicionalGrupoUpdateSchema = {
            parse: jest.fn((data) => data),
        };

        CommonQuerySchema.IdSchema = {
            parse: jest.fn((data) => data),
        };
    });

    describe('listarPorPrato', () => {
        it('deve listar adicionais por prato com sucesso', async () => {
            const pratoId = 'prato-123';
            const mockData = [
                { id: '1', nome: 'Grupo 1', prato_id: pratoId },
                { id: '2', nome: 'Grupo 2', prato_id: pratoId },
            ];

            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue(mockData);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(CommonQuerySchema.IdSchema.parse).toHaveBeenCalledWith(pratoId);
            expect(mockService.listarPorPrato).toHaveBeenCalledWith(pratoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, mockData);
        });

        it('deve lançar erro ao validar pratoId inválido', async () => {
            const error = new Error('ID inválido');
            CommonQuerySchema.IdSchema.parse.mockImplementation(() => {
                throw error;
            });

            mockRequest.params = { pratoId: 'invalid' };

            await expect(controller.listarPorPrato(mockRequest, mockResponse)).rejects.toThrow(error);
        });
        
          it('deve retornar vazio quando não há adicionais', async () => {
            const pratoId = 'prato-456';
            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue([]);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(mockService.listarPorPrato).toHaveBeenCalledWith(pratoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, []);
        });
    });

    describe('buscarPorID', () => {
        it('deve buscar um adicional grupo por ID com sucesso', async () => {
            const id = 'grupo-123';
            const mockData = { id, nome: 'Grupo Premium', prato_id: 'prato-123' };

            mockRequest.params = { id };
            mockService.buscarPorID.mockResolvedValue(mockData);

            await controller.buscarPorID(mockRequest, mockResponse);

            expect(CommonQuerySchema.IdSchema.parse).toHaveBeenCalledWith(id);
            expect(mockService.buscarPorID).toHaveBeenCalledWith(id);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, mockData);
        });

        it('deve lançar erro ao buscar com ID inválido', async () => {
            const error = new Error('ID inválido');
            CommonQuerySchema.IdSchema.parse.mockImplementation(() => {
                throw error;
            });

            mockRequest.params = { id: 'invalid' };

            await expect(controller.buscarPorID(mockRequest, mockResponse)).rejects.toThrow(error);
        });
    });
});
