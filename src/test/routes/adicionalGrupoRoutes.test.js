import adicionalGrupoRoutes from '../../routes/adicionalGrupoRoutes.js';

describe('Routes: AdicionalGrupoRoutes', () => {
    it('deve definir as rotas corretamente', () => {
        const router = adicionalGrupoRoutes;
        
        expect(router).toBeDefined();
        expect(router.stack).toBeDefined();
        expect(router.stack.length).toBeGreaterThan(0);
    });
});
