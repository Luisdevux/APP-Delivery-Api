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

    describe('listarPorIds', () => {
        it('deve listar grupos por um array de IDs', async () => {
            const ids = ['id-1', 'id-2', 'id-3'];
            const mockGrupos = [
                { _id: 'id-1', nome: 'Grupo 1', ativo: true },
                { _id: 'id-2', nome: 'Grupo 2', ativo: true }
            ];

            mockModel.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockGrupos)
            });

            const resultado = await repository.listarPorIds(ids);

            expect(mockModel.find).toHaveBeenCalledWith({
                _id: { $in: ids },
                ativo: true
            });
            expect(resultado).toEqual(mockGrupos);
        });
    });

    describe('buscarPorNomeEntreIds', () => {
        it('deve buscar grupo por nome dentro de IDs específicos', async () => {
            const nome = 'Bebidas';
            const ids = ['id-1', 'id-2'];
            const mockGrupo = { _id: 'id-1', nome: 'Bebidas' };

            mockModel.findOne.mockResolvedValue(mockGrupo);

            const resultado = await repository.buscarPorNomeEntreIds(nome, ids);

            expect(mockModel.findOne).toHaveBeenCalledWith({
                nome,
                _id: { $in: ids }
            });
            expect(resultado).toEqual(mockGrupo);
        });

        it('deve retornar null quando grupo não existe', async () => {
            const nome = 'Inexistente';
            const ids = ['id-1', 'id-2'];

            mockModel.findOne.mockResolvedValue(null);

            const resultado = await repository.buscarPorNomeEntreIds(nome, ids);

            expect(resultado).toBeNull();
        });
    });

    describe('atualizar', () => {
        it('deve atualizar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const parsedData = { nome: 'Bebidas Premium' };
            const mockGrupoAtualizado = {
                _id: grupoId,
                nome: 'Bebidas Premium',
                restaurante_id: 'restaurante-123'
            };

            mockModel.findByIdAndUpdate.mockResolvedValue(mockGrupoAtualizado);

            const resultado = await repository.atualizar(grupoId, parsedData);

            expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
                grupoId,
                parsedData,
                { returnDocument: 'after' }
            );
            expect(resultado).toEqual(mockGrupoAtualizado);
        });
    });

    describe('deletar', () => {
        it('deve deletar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const mockGrupoDeletado = { _id: grupoId, nome: 'Bebidas' };

            mockModel.findByIdAndDelete.mockResolvedValue(mockGrupoDeletado);

            const resultado = await repository.deletar(grupoId);

            expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(grupoId);
            expect(resultado).toEqual(mockGrupoDeletado);
        });
    });
});
