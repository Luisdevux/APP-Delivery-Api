import request from 'supertest';
import express from 'express';
import adicionalGrupoRoutes from '../../routes/adicionalGrupoRoutes.js';
import AdicionalGrupoController from '../../controllers/AdicionalGrupoController.js';

jest.mock('../../controllers/AdicionalGrupoController.js');

describe('Routes: AdicionalGrupoRoutes', () => {
    let app;
    let mockController;

    beforeEach(() => {
        jest.clearAllMocks();

        mockController = {
            listarPorPrato: jest.fn((req, res) => res.json({ success: true })),
            buscarPorID: jest.fn((req, res) => res.json({ success: true })),
            criar: jest.fn((req, res) => res.status(201).json({ success: true })),
            atualizar: jest.fn((req, res) => res.json({ success: true })),
            deletar: jest.fn((req, res) => res.json({ success: true })),
        };

        AdicionalGrupoController.mockImplementation(() => mockController);

        app = express();
        app.use(express.json());
        app.use('/adicionais', adicionalGrupoRoutes);
    });

       describe('GET /adicionais/prato/:pratoId', () => {
        it('deve retornar lista de grupos por prato', async () => {
            mockController.listarPorPrato.mockImplementation((req, res) => {
                res.json([
                    { _id: '1', nome: 'Bebidas', restaurante_id: 'rest-123' },
                    { _id: '2', nome: 'Acompanhamentos', restaurante_id: 'rest-123' }
                ]);
            });

            const response = await request(app)
                .get('/adicionais/prato/prato-123')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(mockController.listarPorPrato).toHaveBeenCalled();
        });
    });
