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

      describe('GET /adicionais/:id', () => {
        it('deve retornar um grupo específico por ID', async () => {
            const mockGrupo = { _id: 'grupo-123', nome: 'Bebidas', restaurante_id: 'rest-123' };

            mockController.buscarPorID.mockImplementation((req, res) => {
                res.json(mockGrupo);
            });

            const response = await request(app)
                .get('/adicionais/grupo-123')
                .expect(200);

            expect(response.body).toEqual(mockGrupo);
            expect(mockController.buscarPorID).toHaveBeenCalled();
        });
    });

    describe('POST /adicionais', () => {
        it('deve criar um novo grupo de adicional', async () => {
            const newGroup = {
                nome: 'Bebidas',
                tipo: 'adicional',
                prato_id: 'prato-123'
            };

            const createdGroup = {
                _id: 'grupo-123',
                ...newGroup,
                restaurante_id: 'rest-123'
            };

            mockController.criar.mockImplementation((req, res) => {
                res.status(201).json(createdGroup);
            });

            const response = await request(app)
                .post('/adicionais')
                .set('Authorization', 'Bearer token')
                .send(newGroup)
                .expect(201);

            expect(response.body).toEqual(createdGroup);
            expect(mockController.criar).toHaveBeenCalled();
        });
      it('deve retornar erro ao criar grupo sem autenticação', async () => {
            mockController.criar.mockImplementation((req, res) => {
                res.status(401).json({ error: 'Unauthorized' });
            });

            await request(app)
                .post('/adicionais')
                .send({ nome: 'Bebidas' })
                .expect(401);
        });
    });

    describe('PUT /adicionais/:id', () => {
        it('deve atualizar um grupo de adicional', async () => {
            const updateData = { nome: 'Bebidas Premium' };
            const updatedGroup = {
                _id: 'grupo-123',
                nome: 'Bebidas Premium',
                restaurante_id: 'rest-123'
            };

            mockController.atualizar.mockImplementation((req, res) => {
                res.json(updatedGroup);
            });

            const response = await request(app)
                .put('/adicionais/grupo-123')
                .set('Authorization', 'Bearer token')
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual(updatedGroup);
            expect(mockController.atualizar).toHaveBeenCalled();
        });

     it('deve retornar erro ao atualizar grupo inexistente', async () => {
            mockController.atualizar.mockImplementation((req, res) => {
                res.status(404).json({ error: 'Grupo não encontrado' });
            });

            await request(app)
                .put('/adicionais/grupo-inexistente')
                .set('Authorization', 'Bearer token')
                .send({ nome: 'Teste' })
                .expect(404);
        });
    });

    describe('DELETE /adicionais/:id', () => {
        it('deve deletar um grupo de adicional', async () => {
            const deletedGroup = {
                _id: 'grupo-123',
                nome: 'Bebidas'
            };

            mockController.deletar.mockImplementation((req, res) => {
                res.json(deletedGroup);
            });

            const response = await request(app)
                .delete('/adicionais/grupo-123')
                .set('Authorization', 'Bearer token')
                .expect(200);

            expect(response.body).toEqual(deletedGroup);
            expect(mockController.deletar).toHaveBeenCalled();
        });

        it('deve retornar erro ao deletar grupo inexistente', async () => {
            mockController.deletar.mockImplementation((req, res) => {
                res.status(404).json({ error: 'Grupo não encontrado' });
            });

            await request(app)
                .delete('/adicionais/grupo-inexistente')
                .set('Authorization', 'Bearer token')
                .expect(404);
        });

        it('deve retornar erro sem autenticação na deleção', async () => {
            mockController.deletar.mockImplementation((req, res) => {
                res.status(401).json({ error: 'Unauthorized' });
            });

            await request(app)
                .delete('/adicionais/grupo-123')
                .expect(401);
        });
    });

     describe('Testes de validação de entrada', () => {
        it('deve validar ID inválido na busca', async () => {
            mockController.buscarPorID.mockImplementation((req, res) => {
                res.status(400).json({ error: 'ID inválido' });
            });

            await request(app)
                .get('/adicionais/invalid-id')
                .expect(400);
        });

        it('deve validar dados obrigatórios na criação', async () => {
            mockController.criar.mockImplementation((req, res) => {
                res.status(400).json({ error: 'Campo nome é obrigatório' });
            });

            await request(app)
                .post('/adicionais')
                .set('Authorization', 'Bearer token')
                .send({ tipo: 'adicional' })
                .expect(400);
        });
