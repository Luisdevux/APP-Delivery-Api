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
        it('quando um prato é consultado, deve retornar seus grupos de adicionais', async () => {
            const pratoId = 'prato-pizza-margherita';
            const grupos = [
                { _id: '1', nome: 'Tamanho', tipo: 'variacao', obrigatorio: true },
                { _id: '2', nome: 'Toppings', tipo: 'adicional', obrigatorio: false },
            ];

            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue(grupos);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(mockService.listarPorPrato).toHaveBeenCalledWith(pratoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, grupos);
        });

        it('se o prato não tem nenhum grupo configurado, retorna lista vazia', async () => {
            const pratoId = 'prato-novo';
            mockRequest.params = { pratoId };
            mockService.listarPorPrato.mockResolvedValue([]);

            await controller.listarPorPrato(mockRequest, mockResponse);

            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, []);
        });
    });

    describe('buscarPorID', () => {
        it('quando um grupo é consultado, retorna os detalhes completos', async () => {
            const grupoId = 'grupo-tamanho-pizza';
            const mockData = {
                _id: grupoId,
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1,
                ativo: true
            };

            mockRequest.params = { id: grupoId };
            mockService.buscarPorID.mockResolvedValue(mockData);

            await controller.buscarPorID(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(grupoId);
            expect(mockService.buscarPorID).toHaveBeenCalledWith(grupoId);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockResponse, mockData);
        });
    });

    describe('criar', () => {
        it('quando um restaurante cria um novo grupo de tamanho de pizza, deve salvar corretamente', async () => {
            const parsedData = {
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1,
                restaurante_id: 'rest-pizza-123'
            };

            const mockGrupo = {
                _id: 'grupo-123',
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                restaurante_id: 'rest-pizza-123',
            };

            AdicionalGrupoSchema.parse.mockReturnValue(parsedData);
            mockService.criar.mockResolvedValue(mockGrupo);

            mockRequest.body = parsedData;

            await controller.criar(mockRequest, mockResponse);

            expect(AdicionalGrupoSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(mockService.criar).toHaveBeenCalled();
            expect(CommonResponse.created).toHaveBeenCalledWith(mockResponse, mockGrupo);
        });
    });

    describe('atualizar', () => {
        it('quando um grupo tem limites alterados (ex: max de toppings), deve atualizar', async () => {
            const grupoId = 'grupo-toppings-123';
            const updateData = {
                max: 5
            };

            const mockGrupoAtualizado = {
                _id: grupoId,
                nome: 'Toppings',
                tipo: 'adicional',
                max: 5,
                restaurante_id: 'rest-123',
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
    });

    describe('deletar', () => {
        it('quando um grupo é removido, marca como inativo (soft-delete)', async () => {
            const grupoId = 'grupo-bebidas-123';
            const mockGrupoDeletado = {
                _id: grupoId,
                nome: 'Bebidas',
                ativo: false,
            };

            mockService.deletar.mockResolvedValue(mockGrupoDeletado);
            CommonResponse.success.mockReturnValue(mockResponse);

            mockRequest.params = { id: grupoId };

            await controller.deletar(mockRequest, mockResponse);

            expect(IdSchema.parse).toHaveBeenCalledWith(grupoId);
            expect(mockService.deletar).toHaveBeenCalledWith(grupoId, mockRequest);
            expect(CommonResponse.success).toHaveBeenCalled();
        });
    });
});
