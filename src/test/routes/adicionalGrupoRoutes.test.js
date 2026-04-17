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