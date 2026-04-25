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
