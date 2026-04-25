jest.mock('../../controllers/AvaliacaoController.js', () => ({
    __esModule: true,
    default: class {
        constructor() {
            this.listarPorRestaurante = jest.fn();
            this.criar = jest.fn();
        }
    }
}));

import avaliacaoRoutes from '../../routes/avaliacaoRoute.js';
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

describe('Routes: AvaliacaoRoutes', () => {
    it('deve definir as rotas corretamente', () => {
        const router = avaliacaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        expect(router).toBeDefined();
        expect(routes.length).toBe(2);

        const pathNames = routes.map(route => route.path);
        expect(pathNames).toEqual(
            expect.arrayContaining([
                '/avaliacoes/restaurante/:restauranteId',
                '/avaliacoes',
            ]),
        );
    });

    it('deve proteger a rota de criação com AuthMiddleware', () => {
        const router = avaliacaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const createRoute = routes.find(route => route.path === '/avaliacoes' && route.methods.post);
        expect(createRoute).toBeDefined();
        expect(createRoute.stack.some(layer => layer.handle === AuthMiddleware)).toBe(true);
    });

    it('deve deixar a rota de listagem por restaurante pública', () => {
        const router = avaliacaoRoutes;
        const routes = router.stack.filter(layer => layer.route).map(layer => layer.route);

        const listRoute = routes.find(
            route => route.path === '/avaliacoes/restaurante/:restauranteId' && route.methods.get,
        );

        expect(listRoute).toBeDefined();
        expect(listRoute.stack.some(layer => layer.handle === AuthMiddleware)).toBe(false);
    });
});