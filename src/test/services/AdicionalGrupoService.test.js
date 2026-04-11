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
        });
    });

    describe('buscarPorID', () => {
        it('deve buscar um grupo por ID com sucesso', async () => {
            const grupoId = 'grupo-123';
            const mockGrupo = { _id: grupoId, nome: 'Bebidas' };

            mockGrupoRepository.buscarPorID.mockResolvedValue(mockGrupo);

            const resultado = await service.buscarPorID(grupoId);

            expect(mockGrupoRepository.buscarPorID).toHaveBeenCalledWith(grupoId);
            expect(resultado).toEqual(mockGrupo);
        });
    });

    describe('listarPorPrato', () => {
        it('deve listar grupos por prato com sucesso', async () => {
            const pratoId = 'prato-123';
            const grupoIds = ['grupo-1', 'grupo-2'];

            const mockPrato = {
                _id: pratoId,
                adicionais_grupo_ids: grupoIds,
            };

            const mockGrupos = [
                { _id: 'grupo-1', nome: 'Bebidas' },
                { _id: 'grupo-2', nome: 'Acompanhamentos' },
            ];

            mockPratoRepository.buscarPorID.mockResolvedValue(mockPrato);
            mockGrupoRepository.listarPorIds.mockResolvedValue(mockGrupos);

            const resultado = await service.listarPorPrato(pratoId);

            expect(mockPratoRepository.buscarPorID).toHaveBeenCalledWith(pratoId);
            expect(mockGrupoRepository.listarPorIds).toHaveBeenCalledWith(grupoIds);
            expect(resultado).toEqual(mockGrupos);
        });
    });

    describe('atualizar', () => {
        it('deve atualizar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const restauranteId = 'restaurante-123';
            const donoId = 'dono-123';
            const usuarioId = 'user-123';

            const parsedData = {
                nome: 'Bebidas Premium',
            };

            const mockGrupo = {
                _id: grupoId,
                nome: 'Bebidas',
                restaurante_id: restauranteId,
            };

            const mockRestaurante = {
                _id: restauranteId,
                dono_id: { _id: donoId },
            };

            const mockUsuario = {
                _id: usuarioId,
                isAdmin: false,
            };

            const mockGrupoAtualizado = {
                ...mockGrupo,
                nome: 'Bebidas Premium',
            };

            mockGrupoRepository.buscarPorID.mockResolvedValue(mockGrupo);
            mockRestauranteRepository.buscarPorID.mockResolvedValue(mockRestaurante);
            mockUsuarioRepository.buscarPorID.mockResolvedValue(mockUsuario);
            mockGrupoRepository.atualizar.mockResolvedValue(mockGrupoAtualizado);

            const mockRequest = { user_id: usuarioId };

            const resultado = await service.atualizar(grupoId, parsedData, mockRequest);

            expect(mockGrupoRepository.buscarPorID).toHaveBeenCalledWith(grupoId);
            expect(mockGrupoRepository.atualizar).toHaveBeenCalledWith(grupoId, parsedData);
            expect(resultado).toEqual(mockGrupoAtualizado);
        });
    });

    describe('deletar', () => {
        it('deve deletar um grupo com sucesso', async () => {
            const grupoId = 'grupo-123';
            const restauranteId = 'restaurante-123';
            const donoId = 'dono-123';
            const usuarioId = 'user-123';

            const mockGrupo = {
                _id: grupoId,
                nome: 'Bebidas',
                restaurante_id: restauranteId,
            };

            const mockRestaurante = {
                _id: restauranteId,
                dono_id: { _id: donoId },
            };

            const mockUsuario = {
                _id: usuarioId,
                isAdmin: false,
            };

            const mockGrupoDeletado = { ...mockGrupo };

            mockGrupoRepository.buscarPorID.mockResolvedValue(mockGrupo);
            mockRestauranteRepository.buscarPorID.mockResolvedValue(mockRestaurante);
            mockUsuarioRepository.buscarPorID.mockResolvedValue(mockUsuario);
            mockOpcaoRepository.deletarPorGrupo.mockResolvedValue(true);
            mockGrupoRepository.deletar.mockResolvedValue(mockGrupoDeletado);

            const mockRequest = { user_id: usuarioId };

            const resultado = await service.deletar(grupoId, mockRequest);

            expect(mockGrupoRepository.buscarPorID).toHaveBeenCalledWith(grupoId);
            expect(mockOpcaoRepository.deletarPorGrupo).toHaveBeenCalledWith(grupoId);
            expect(mockGrupoRepository.deletar).toHaveBeenCalledWith(grupoId);
            expect(resultado).toEqual(mockGrupoDeletado);
        });
    });
});