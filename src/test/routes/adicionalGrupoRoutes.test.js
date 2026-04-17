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

    it('deve proteger as rotas de criação, atualização e exclusão com AuthMiddleware', () => {
        const router = adicionalGrupoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const authenticatedRoutes = [
            { path: '/adicionais/grupos', method: 'post' },
            { path: '/adicionais/grupos/:id', method: 'patch' },
            { path: '/adicionais/grupos/:id', method: 'delete' },
        ];

        authenticatedRoutes.forEach(({ path, method }) => {
            const route = routes.find(route => route.path === path && route.methods[method]);
            expect(route).toBeDefined();
            expect(route.stack.some(layer => layer.handle === AuthMiddleware)).toBe(true);
        });
    });

    it('deve deixar as rotas de listagem públicas', () => {
        const router = adicionalGrupoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const listRoutes = [
            { path: '/adicionais/grupos/prato/:pratoId', method: 'get' },
            { path: '/adicionais/grupos/:id', method: 'get' },
        ];

        listRoutes.forEach(({ path, method }) => {
            const route = routes.find(route => route.path === path && route.methods[method]);
            expect(route).toBeDefined();
            expect(route.stack.some(layer => layer.handle === AuthMiddleware)).toBe(false);
        });
    });
});
