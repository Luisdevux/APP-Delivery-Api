import AdicionalGrupoService from '../../service/AdicionalGrupoService.js';
import AdicionalGrupoRepository from '../../repository/AdicionalGrupoRepository.js';
import AdicionalOpcaoRepository from '../../repository/AdicionalOpcaoRepository.js';
import RestauranteRepository from '../../repository/RestauranteRepository.js';
import PratoRepository from '../../repository/PratoRepository.js';
import UsuarioRepository from '../../repository/UsuarioRepository.js';
import { CustomError, HttpStatusCodes, ensurePermission } from '../../utils/helpers/index.js';

jest.mock('../../repository/AdicionalGrupoRepository.js');
jest.mock('../../repository/AdicionalOpcaoRepository.js');
jest.mock('../../repository/RestauranteRepository.js');
jest.mock('../../repository/PratoRepository.js');
jest.mock('../../repository/UsuarioRepository.js');
jest.mock('../../utils/helpers/index.js');

describe('Service: AdicionalGrupoService', () => {
    let service;
    let mockGrupoRepository;
    let mockOpcaoRepository;
    let mockRestauranteRepository;
    let mockPratoRepository;
    let mockUsuarioRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        mockGrupoRepository = {
            buscarPorID: jest.fn(),
            criar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            listarPorIds: jest.fn(),
            buscarPorNomeEntreIds: jest.fn(),
        };

        mockOpcaoRepository = {
            deletarPorGrupo: jest.fn(),
        };

        mockRestauranteRepository = {
            buscarPorID: jest.fn(),
        };

        mockPratoRepository = {
            buscarPorID: jest.fn(),
            atualizar: jest.fn(),
        };

        mockUsuarioRepository = {
            buscarPorID: jest.fn(),
        };

        AdicionalGrupoRepository.mockImplementation(() => mockGrupoRepository);
        AdicionalOpcaoRepository.mockImplementation(() => mockOpcaoRepository);
        RestauranteRepository.mockImplementation(() => mockRestauranteRepository);
        PratoRepository.mockImplementation(() => mockPratoRepository);
        UsuarioRepository.mockImplementation(() => mockUsuarioRepository);

        service = new AdicionalGrupoService();
    });

    describe('criar', () => {
        it('deve criar um novo grupo de adicional com sucesso', async () => {
            const pratoId = 'prato-123';
            const restauranteId = 'restaurante-123';
            const donoId = 'dono-123';
            const usuarioId = 'user-123';

            const parsedData = {
                nome: 'Bebidas',
                tipo: 'adicional',
                obrigatorio: false,
            };

            const mockPrato = {
                _id: pratoId,
                restaurante_id: restauranteId,
                adicionais_grupo_ids: [],
            };

            const mockRestaurante = {
                _id: restauranteId,
                dono_id: { _id: donoId },
            };

            const mockUsuario = {
                _id: usuarioId,
                isAdmin: false,
            };

            const mockGrupo = {
                _id: 'grupo-123',
                ...parsedData,
                restaurante_id: restauranteId,
            };


            mockPratoRepository.buscarPorID.mockResolvedValue(mockPrato);
            mockRestauranteRepository.buscarPorID.mockResolvedValue(mockRestaurante);
            mockUsuarioRepository.buscarPorID.mockResolvedValue(mockUsuario);
            mockGrupoRepository.buscarPorNomeEntreIds.mockResolvedValue(null);
            mockGrupoRepository.criar.mockResolvedValue(mockGrupo);
            mockPratoRepository.atualizar.mockResolvedValue(true);

            const mockRequest = { user_id: usuarioId };

            const resultado = await service.criar(parsedData, pratoId, mockRequest);

            expect(mockPratoRepository.buscarPorID).toHaveBeenCalledWith(pratoId);
            expect(mockRestauranteRepository.buscarPorID).toHaveBeenCalledWith(restauranteId);
            expect(mockUsuarioRepository.buscarPorID).toHaveBeenCalledWith(usuarioId);
            expect(mockGrupoRepository.criar).toHaveBeenCalled();
            expect(resultado).toEqual(mockGrupo);

                it('deve lançar erro se nome já existe no prato', async () => {
                const pratoId = 'prato-123';
                const restauranteId = 'restaurante-123';
                const donoId = 'dono-123';
                const usuarioId = 'user-123';

                const parsedData = {
                    nome: 'Bebidas',
                    tipo: 'adicional',
                };

                const mockPrato = {
                    _id: pratoId,
                    restaurante_id: restauranteId,
                    adicionais_grupo_ids: ['grupo-existente'],
                };

                const mockRestaurante = {
                    _id: restauranteId,
                    dono_id: { _id: donoId },
                };

                const mockUsuario = {
                    _id: usuarioId,
                    isAdmin: false,
                };

                const grupoExistente = { _id: 'grupo-existente', nome: 'Bebidas' };

                mockPratoRepository.buscarPorID.mockResolvedValue(mockPrato);
                mockRestauranteRepository.buscarPorID.mockResolvedValue(mockRestaurante);
                mockUsuarioRepository.buscarPorID.mockResolvedValue(mockUsuario);
                mockGrupoRepository.buscarPorNomeEntreIds.mockResolvedValue(grupoExistente);

                const mockRequest = { user_id: usuarioId };

                await expect(service.criar(parsedData, pratoId, mockRequest)).rejects.toThrow();
                expect(mockGrupoRepository.criar).not.toHaveBeenCalled();
            });
        });
    });
});