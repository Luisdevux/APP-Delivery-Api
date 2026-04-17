jest.mock('../../controllers/AdicionalOpcaoController.js', () => ({
    __esModule: true,
    default: class {
        constructor() {
            this.listar = jest.fn();
            this.criar = jest.fn();
            this.atualizar = jest.fn();
            this.deletar = jest.fn();
            this.fotoUpload = jest.fn();
            this.fotoDelete = jest.fn();
        }
    }
}));

import adicionalOpcaoRoutes from '../../routes/adicionalOpcaoRoutes.js';
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

describe('Routes: AdicionalOpcaoRoutes', () => {
    it('deve definir as rotas corretamente', () => {
        const router = adicionalOpcaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        expect(router).toBeDefined();
        expect(routes.length).toBe(6);

        const pathNames = routes.map(route => route.path);
        expect(pathNames).toEqual(
            expect.arrayContaining([
                '/adicionais/opcoes/:grupoId',
                '/adicionais/opcoes',
                '/adicionais/opcoes/:id',
                '/adicionais/opcoes/:id/foto',
            ]),
        );
    });

    it('deve proteger as rotas de criação, atualização, exclusão e upload de foto com AuthMiddleware', () => {
        const router = adicionalOpcaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const authenticatedRoutes = [
            { path: '/adicionais/opcoes', method: 'post' },
            { path: '/adicionais/opcoes/:id', method: 'patch' },
            { path: '/adicionais/opcoes/:id', method: 'delete' },
            { path: '/adicionais/opcoes/:id/foto', method: 'post' },
            { path: '/adicionais/opcoes/:id/foto', method: 'delete' },
        ];

        authenticatedRoutes.forEach(({ path, method }) => {
            const route = routes.find(route => route.path === path && route.methods[method]);
            expect(route).toBeDefined();
            expect(route.stack.some(layer => layer.handle === AuthMiddleware)).toBe(true);
        });
    });

    it('deve deixar a rota de listagem pública', () => {
        const router = adicionalOpcaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const listRoute = routes.find(route => route.path === '/adicionais/opcoes/:grupoId' && route.methods.get);
        expect(listRoute).toBeDefined();
        expect(listRoute.stack.some(layer => layer.handle === AuthMiddleware)).toBe(false);
    });
});
