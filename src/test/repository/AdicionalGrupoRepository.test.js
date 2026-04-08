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

});