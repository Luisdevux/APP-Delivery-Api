import AdicionalGrupoRepository from '../../repository/AdicionalGrupoRepository.js';
import AdicionalGrupo from '../../models/AdicionalGrupo.js';
import { CustomError, messages } from '../../utils/helpers/index.js';

jest.mock('../../models/AdicionalGrupo.js');
jest.mock('../../utils/helpers/index.js');

describe('Repository: AdicionalGrupoRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
        jest.clearAllMocks();

        mockModel = {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            paginate: jest.fn(),
        };

        repository = new AdicionalGrupoRepository({ AdicionalGrupoModel: mockModel });
    });

    describe('buscarPorID', () => {
        it('deve buscar um grupo por ID com sucesso', async () => {
            const grupoId = 'grupo-123';
            const mockGrupo = {
                _id: grupoId,
                nome: 'Bebidas',
                restaurante_id: 'restaurante-123',
                ativo: true
            };

            mockModel.findById.mockResolvedValue(mockGrupo);

            const resultado = await repository.buscarPorID(grupoId);

            expect(mockModel.findById).toHaveBeenCalledWith(grupoId);
            expect(resultado).toEqual(mockGrupo);
        });

        it('deve lançar erro quando grupo não existe', async () => {
            const grupoId = 'grupo-inexistente';
            mockModel.findById.mockResolvedValue(null);

            await expect(repository.buscarPorID(grupoId)).rejects.toThrow();
            expect(mockModel.findById).toHaveBeenCalledWith(grupoId);
        });
    });
   describe('listar', () => {
        it('deve listar grupos com filtros e paginação', async () => {
            const mockRequest = {
                params: {},
                query: { nome: 'Bebidas', ativo: 'true', page: 1, limite: 10 }
            };

            const mockResult = {
                docs: [
                    { _id: '1', nome: 'Bebidas', restaurante_id: 'rest-123' },
                    { _id: '2', nome: 'Acompanhamentos', restaurante_id: 'rest-123' }
                ],
                totalDocs: 2,
                page: 1,
                pages: 1
            };

            mockModel.paginate.mockResolvedValue(mockResult);

            const resultado = await repository.listar(mockRequest);

            expect(mockModel.paginate).toHaveBeenCalled();
            expect(resultado.docs).toHaveLength(2);
        });

        it('deve buscar grupo específico por ID no params', async () => {
            const grupoId = 'grupo-123';
            const mockGrupo = { _id: grupoId, nome: 'Bebidas' };
            const mockRequest = {
                params: { id: grupoId },
                query: {}
            };

            mockModel.findById.mockResolvedValue(mockGrupo);

            const resultado = await repository.listar(mockRequest);

            expect(mockModel.findById).toHaveBeenCalledWith(grupoId);
            expect(resultado).toEqual(mockGrupo);
        });

        it('deve lançar erro quando grupo específico não existe', async () => {
            const grupoId = 'grupo-inexistente';
            const mockRequest = {
                params: { id: grupoId },
                query: {}
            };

            mockModel.findById.mockResolvedValue(null);

            await expect(repository.listar(mockRequest)).rejects.toThrow();
        });
    });

    describe('listarPorRestaurante', () => {
        it('deve listar grupos ativos de um restaurante', async () => {
            const restauranteId = 'restaurante-123';
            const mockGrupos = [
                { _id: '1', nome: 'Bebidas', ativo: true },
                { _id: '2', nome: 'Acompanhamentos', ativo: true }
            ];

            mockModel.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockGrupos)
            });

            const resultado = await repository.listarPorRestaurante(restauranteId);

            expect(mockModel.find).toHaveBeenCalledWith({
                restaurante_id: restauranteId,
                ativo: true
            });
            expect(resultado).toEqual(mockGrupos);
        });
    });
});
