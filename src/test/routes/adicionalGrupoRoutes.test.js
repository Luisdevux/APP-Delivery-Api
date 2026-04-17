jest.mock('../../controllers/AdicionalGrupoController.js', () => ({
    __esModule: true,
    default: class {
        constructor() {
            this.listarPorPrato = jest.fn();
            this.buscarPorID = jest.fn();
            this.criar = jest.fn();
            this.atualizar = jest.fn();
            this.deletar = jest.fn();
        }
    }
}));

import adicionalGrupoRoutes from '../../routes/adicionalGrupoRoutes.js';
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

describe('Routes: AdicionalGrupoRoutes', () => {
    it('deve definir as rotas corretamente', () => {
        const router = adicionalGrupoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        expect(router).toBeDefined();
        expect(routes.length).toBe(5);

        const pathNames = routes.map(route => route.path);
        expect(pathNames).toEqual(
            expect.arrayContaining([
                '/adicionais/grupos/prato/:pratoId',
                '/adicionais/grupos/:id',
                '/adicionais/grupos',
            ]),
        );
    });